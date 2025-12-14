import json
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    FreeKassa payment webhook handler
    Обрабатывает уведомления о платежах от FreeKassa
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        
        try:
            if event.get('isBase64Encoded'):
                import base64
                body_str = base64.b64decode(body_str).decode('utf-8')
            
            params = {}
            if body_str:
                for pair in body_str.split('&'):
                    if '=' in pair:
                        key, value = pair.split('=', 1)
                        params[key] = value
            
            merchant_id = params.get('MERCHANT_ID', '')
            amount = params.get('AMOUNT', '')
            order_id = params.get('MERCHANT_ORDER_ID', '')
            sign = params.get('SIGN', '')
            
            secret_key = 'YOUR_SECRET_KEY_2'
            expected_sign = hashlib.md5(
                f"{merchant_id}:{amount}:{secret_key}:{order_id}".encode()
            ).hexdigest()
            
            if sign == expected_sign:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'status': 'success',
                        'message': 'Payment verified',
                        'order_id': order_id
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid signature'}),
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
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
