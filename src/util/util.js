/**
 * 根据用户信息，返回跳转地址
 * @param type    user.type /boss /genius
 * @param avatar  user.avatar
 * @returns {string}  应该跳转地址
 */
export function getRedirectPath({type, avatar}) {
    let url = (type === 'boss') ? '/boss' : '/genius'
    if (!avatar) {
        url += 'info'
    }
    return url
}

// 我和你的对话 你和我的对话 实际上可以看成一个会话
export function getChatId(userId, targeId) {
    return [userId, targeId].sort().join('_')
}

