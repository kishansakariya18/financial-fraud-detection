// ai-chat.js
import apiConfig from 'configs/api.config';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { RiRobot2Line } from 'react-icons/ri';

export function getAiChatBot() {
  const token = localStorage.getItem('AuthToken');
  // console.log('token during load', token);

  return {
    id: 'ai_chat',
    type: NAV_TYPE_ITEM,
    path: `${apiConfig.baseURL.AI_CHAT_URL}?token=${token}`,
    title: 'AI Chat',
    transKey: 'aiChat',
    Icon: RiRobot2Line,
    permission: PERMISSIONS.EMAIL_TEMPLATE.LIST
  };
}
