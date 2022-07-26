import { Request, Response } from 'express'
import * as yup from 'yup';
import Comment from '../model/commentModel';
import UploadImagesService from '../services/UploadImagesService';

class CommentController{
    async new(request: Request, response: Response){
        const schema = yup.object().shape({
            user_id: yup.string().required(),
            displayText: yup.string()
        })
        if(!(await schema.isValid(request.body))){
            return response.json({error: true, message: 'Error'});
        }
        if(!request.body.displayText && !request.file){
            return response.json({error: true, message: 'the fields were not filld'});
        }
        if(!request.file){
            await Comment.create({...request.body})
            return response.json({message: 'Done'})
        }
        if(request.file){
            const uploadImagesService = new UploadImagesService();
            await uploadImagesService.execute(request.file);
            
            await Comment.create({
                ...request.body,
                fileName: request.file.filename,
                key: request.file.filename,
                fileUrl: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${request.file?.filename}`
            }).then(() =>{
                return response.json({message: 'Done!'})
            }).catch(() =>{
                return response.json({error: true, message: 'An unexpected error occurred'})
            })
        }
    }
    async list(request: Request, response: Response){
        const comments = await Comment.find({ Comment_id: request.params.Comment_id });

        return response.json({comments})
    }
    async comment(request: Request, response: Response){
        const comment = await Comment.findOne({_id: request.params.id});

        return response.json({comment})
    }
}

export default new CommentController;