let user_tokens = {}

export function validateUserToken(user_id, token){
    return (user_tokens[user_id] && user_tokens[user_id].token === token && user_tokens[user_id].expiration > Date.now()) || false;
}

export function issueUserToken(user_id, new_token) {
    for (let key in user_tokens) {
        if(user_tokens[key].expiration < Date.now()) delete user_tokens[key];
    }
    user_tokens[user_id] = {token: new_token, expiration: Date.now() + 24*3600*1000}
}