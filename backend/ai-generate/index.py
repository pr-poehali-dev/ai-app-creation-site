import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    OpenAI API integration для генерации кода
    POST /ai-generate - генерация кода по промпту
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_str = event.get('body', '{}')
            if isinstance(body_str, bytes):
                body_str = body_str.decode('utf-8')
            
            if isinstance(body_str, str):
                data = json.loads(body_str)
            else:
                data = body_str or {}
            
            prompt = data.get('prompt', '') if isinstance(data, dict) else ''
            language = data.get('language', 'javascript') if isinstance(data, dict) else 'javascript'
            
            if not prompt:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Prompt is required'}),
                    'isBase64Encoded': False
                }
            
            openai_key = os.environ.get('OPENAI_API_KEY')
            
            if not openai_key:
                generated_code = f"""// Код сгенерирован по запросу: "{prompt}"
// Для полноценной работы необходим OPENAI_API_KEY

function generatedFunction() {{
    // {prompt}
    console.log('Функция создана по запросу');
    return 'Success';
}}

generatedFunction();"""
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'code': generated_code,
                        'demo': True,
                        'message': 'Demo mode - add OPENAI_API_KEY for real AI generation'
                    }),
                    'isBase64Encoded': False
                }
            
            try:
                import openai
                
                client = openai.OpenAI(api_key=openai_key)
                
                system_prompt = f"You are a code generation assistant. Generate clean, well-documented {language} code based on user requests. Only return the code, no explanations."
                
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1500,
                    temperature=0.7
                )
                
                generated_code = response.choices[0].message.content.strip()
                
                if generated_code.startswith('```'):
                    lines = generated_code.split('\n')
                    generated_code = '\n'.join(lines[1:-1]) if len(lines) > 2 else generated_code
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'code': generated_code,
                        'demo': False,
                        'tokens': response.usage.total_tokens
                    }),
                    'isBase64Encoded': False
                }
                
            except ImportError:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'OpenAI library not installed'}),
                    'isBase64Encoded': False
                }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }