const { UserInputError, AuthenticationError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const checkauth = require('../../util/check-auth')


module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkauth(context)
            if (body.trim() === '') {
                throw new UserInputError('empty comment', {
                    errors: {
                        body: 'comment body must not empty'
                    }
                })
            }
            const post = await post.findById(postId)

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            } else throw new UserInputError('post not found')
        },
        async deleteComment(_, { postId, commentId }, context) {
            const username = checkAuth(context)
            const post = post.findById(postId)

            if (post) {
                const commentIndex = post.comments.findIndex((c) => c.id === commentId)

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return post
                } else {
                    throw new AuthenticationError('action not allowed')
                }
            } else {
                throw new UserInputError('post not found')
            }
        }
    }
}