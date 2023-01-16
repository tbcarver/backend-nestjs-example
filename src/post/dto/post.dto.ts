import { IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly text: string;
}
