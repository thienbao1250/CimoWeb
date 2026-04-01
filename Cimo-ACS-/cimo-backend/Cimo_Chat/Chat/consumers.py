import json
from datetime import datetime, timedelta
from channels.generic.websocket import AsyncWebsocketConsumer
import pymongo

# Kết nối MongoDB
mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
chat_db = mongo_client["chat_db"]
chat_rooms_collection = chat_db["chat_rooms"]

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Xử lý khi user kết nối vào phòng chat riêng"""
        self.room_id = self.scope['url_route']['kwargs']['room_name']

        await self.channel_layer.group_add(
            self.room_id,
            self.channel_name
        )
        await self.accept()

        # Gửi lịch sử tin nhắn
        chat = chat_rooms_collection.find_one({"room_id": self.room_id})
        if chat:
            messages = chat.get("messages", [])
            for msg in messages:
                if "timestamp" in msg and isinstance(msg["timestamp"], datetime):
                    msg["timestamp"] = msg["timestamp"].isoformat()

            await self.send(text_data=json.dumps({
                "type": "load_old_messages",
                "messages": messages
            }))

    async def receive(self, text_data):
        """Nhận tin nhắn từ user và gửi tới đúng người nhận"""
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']
        sender_role = data.get('sender_role', 'unknown')  # Thêm role vào dữ liệu

        new_message = {
            "sender_id": sender_id,
            "sender_role": sender_role,  # Lưu role vào MongoDB
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        chat_rooms_collection.update_one(
            {"room_id": self.room_id},
            {"$push": {"messages": new_message}},
            upsert=True
        )

        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "private_chat_message",
                "message": message,
                "sender_id": sender_id,
                "sender_role": sender_role,  # Gửi role về frontend
                "timestamp": new_message["timestamp"]
            }
        )

    async def private_chat_message(self, event):
        """Gửi tin nhắn tới đúng người trong phòng"""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_role": event["sender_role"],  # Đảm bảo gửi role về frontend
            "timestamp": event["timestamp"]
        }))
    
    
