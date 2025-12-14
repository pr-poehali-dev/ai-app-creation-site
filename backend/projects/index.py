import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Projects API - управление проектами пользователей
    GET /projects?user_id=X - получить все проекты пользователя
    POST /projects - создать новый проект
    PUT /projects - обновить проект
    GET /projects/:id - получить проект по ID
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            project_id = params.get('id')
            
            if project_id:
                cursor.execute(
                    'SELECT * FROM projects WHERE id = %s',
                    (project_id,)
                )
                project = cursor.fetchone()
                
                if project:
                    cursor.execute(
                        'SELECT * FROM project_history WHERE project_id = %s ORDER BY created_at DESC LIMIT 10',
                        (project_id,)
                    )
                    history = cursor.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'project': dict(project),
                            'history': [dict(h) for h in history]
                        }, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Project not found'}),
                        'isBase64Encoded': False
                    }
            
            elif user_id:
                cursor.execute(
                    'SELECT * FROM projects WHERE user_id = %s ORDER BY updated_at DESC',
                    (user_id,)
                )
                projects = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'projects': [dict(p) for p in projects]
                    }, default=str),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id or id parameter required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_str = event.get('body', '{}')
            data = json.loads(body_str)
            
            user_id = data.get('user_id')
            name = data.get('name', 'Untitled Project')
            description = data.get('description', '')
            language = data.get('language', 'javascript')
            code = data.get('code', '')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                '''INSERT INTO projects (user_id, name, description, language, code, status) 
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING *''',
                (user_id, name, description, language, code, 'draft')
            )
            project = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'project': dict(project)}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_str = event.get('body', '{}')
            data = json.loads(body_str)
            
            project_id = data.get('id')
            name = data.get('name')
            description = data.get('description')
            language = data.get('language')
            code = data.get('code')
            status = data.get('status')
            change_message = data.get('change_message')
            
            if not project_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'project id is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            if name is not None:
                update_fields.append('name = %s')
                update_values.append(name)
            if description is not None:
                update_fields.append('description = %s')
                update_values.append(description)
            if language is not None:
                update_fields.append('language = %s')
                update_values.append(language)
            if code is not None:
                update_fields.append('code = %s')
                update_values.append(code)
            if status is not None:
                update_fields.append('status = %s')
                update_values.append(status)
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(project_id)
            
            if update_fields:
                query = f"UPDATE projects SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                cursor.execute(query, tuple(update_values))
                project = cursor.fetchone()
                
                if code is not None:
                    cursor.execute(
                        'INSERT INTO project_history (project_id, code, change_message) VALUES (%s, %s, %s)',
                        (project_id, code, change_message or 'Code updated')
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'project': dict(project)}, default=str),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            cursor.close()
            conn.close()
