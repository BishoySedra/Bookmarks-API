import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class BookmarkDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUrl()
    @IsNotEmpty()
    link: string;

    @IsString()
    @IsOptional()
    description?: string;
}