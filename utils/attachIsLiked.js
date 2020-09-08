module.exports.attachIsLiked = (post, userId) => {
    let likeList = post.likes.map(l => {
        return l.likedBy.toString()
    })
    post.isLiked = likeList.includes(userId)
    return post
}