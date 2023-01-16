import { Controller, Delete, Param, HttpException, HttpStatus, UseGuards, Post, Body, Req } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.gaurd';
import { PostDto } from './dto/post.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) { }

  @Post()
  async createPost(@Body() postDto: PostDto, @Req() req: any) {
    const post = new PostEntity();
    post.text = postDto.text;
    post.title = postDto.title;
    post.userId = req.user.userId;
    await this.postRepository.save(post);
    return { message: 'Post created successfully.' };
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number, @Req() req: any) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    if (post.userId !== req.user.userId) {
      throw new HttpException('You do not have permission to delete this post', HttpStatus.UNAUTHORIZED);
    }
    await this.postRepository.delete({ id });
    return { message: 'Post deleted successfully' };
  }
}
