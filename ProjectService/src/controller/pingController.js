export async function pingChecker(req, res) {
    return res.status(200).json({message: "pong"});
}