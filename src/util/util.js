export function getRedirectPath({type, avatar}) {
    // 根据用户信息，返回跳转地址
    // user.type /boss /genius
    // user.avatar /geniusinfo
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