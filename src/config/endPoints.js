export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1/admin' : 'http://ec2-3-139-240-106.us-east-2.compute.amazonaws.com:3000/api/v1/admin';
//export const IMAGE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/upload/' : 'http://ec2-3-139-240-106.us-east-2.compute.amazonaws.com:3000/upload/';
export const IMAGE_URL=process.env.NODE_ENV === 'development'? 'http://localhost:3000' : 'https://listing-upload.s3.us-east-2.amazonaws.com/'
export const AUTH_ENDPOINT = `${BASE_URL}/auth`
export const CATEGORY_ENDPOINT = `${BASE_URL}`
export const UPDATE_CATEGORY_ENDPOINT = `${BASE_URL}/category`
export const DELETE_CATEGORY_ENDPOINT = `${BASE_URL}/category`
export const POSTS_ENDPOINT = `${BASE_URL}/posts`
export const CHANGE_PASSWORD_ENDPOINT = `${BASE_URL}/auth/changePassword`

// export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost);