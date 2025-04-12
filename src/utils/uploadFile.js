const url = `https://api.cloudinary.com/v1_1/dq7yvdlsd/auto/upload`

export const uploadFile= async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append('upload_preset',"chat-app-file")

    const response = fetch(url,{
        method:'post',
        body:formData
    })
    const responseData = (await response).json()

    return responseData
}