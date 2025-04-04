let user_tokens = {}

export function issueUserToken(user_id, new_token) {
    for (let key in user_tokens) {
        if(user_tokens[key].expiration < Date.now() || user_tokens[key].user_id === user_id) delete user_tokens[key];
    }
    user_tokens[new_token] = {user_id: user_id, expiration: Date.now() + 24*3600*1000}
    return new_token;
}

export function validateUserToken(req, res, next) {
    if (req.headers.authorization) {
        let bearerToken = req.headers.authorization.split(' ')[1];
        if(user_tokens[bearerToken] && user_tokens[bearerToken].expiration > Date.now()){
            req.validated_user = user_tokens[bearerToken].user_id;
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
}