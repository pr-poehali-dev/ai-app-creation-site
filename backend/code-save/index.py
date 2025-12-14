import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Сохранение кода проекта с версионированием
    Методы: POST /save - сохранить код, GET /history - получить историю версий
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Project-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            project_id = body.get('project_id')
            code = body.get('code', '')
            change_message = body.get('change_message', 'Автосохранение')
            
            if not project_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'project_id required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE t_p56286601_ai_app_creation_site.projects SET code = %s, updated_at = NOW() WHERE id = %s RETURNING id",
                (code, project_id)
            )
            result = cur.fetchone()
            
            if not result:
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Project not found'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO t_p56286601_ai_app_creation_site.project_history 
                (project_id, code, change_message, created_at) 
                VALUES (%s, %s, %s, NOW())""",
                (project_id, code, change_message)
            )
            
            conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Code saved successfully'
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            project_id = params.get('project_id')
            
            if not project_id:
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'project_id required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """SELECT p.code as current_code, p.updated_at 
                FROM t_p56286601_ai_app_creation_site.projects p 
                WHERE p.id = %s""",
                (project_id,)
            )
            project_data = cur.fetchone()
            
            if not project_data:
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Project not found'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """SELECT id, code, change_message, created_at 
                FROM t_p56286601_ai_app_creation_site.project_history 
                WHERE project_id = %s 
                ORDER BY created_at DESC 
                LIMIT 50""",
                (project_id,)
            )
            history_rows = cur.fetchall()
            
            history = [
                {
                    'id': row[0],
                    'code': row[1],
                    'change_message': row[2],
                    'created_at': row[3].isoformat() if row[3] else None
                }
                for row in history_rows
            ]
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'current_code': project_data[0],
                    'updated_at': project_data[1].isoformat() if project_data[1] else None,
                    'history': history
                }),
                'isBase64Encoded': False
            }
        
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
