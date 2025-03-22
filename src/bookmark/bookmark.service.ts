import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prismaService: PrismaService) { }

    // service method to get all bookmarks
    async getBookmarks(userId: number) {
        const bookmarks = await this.prismaService.bookmark.findMany({
            where: {
                userId,
            },
        });

        return bookmarks;
    }

    // service method to create a bookmark
    async createBookmark(userId: number, bookmarkDto: BookmarkDto) {
        const bookmark = await this.prismaService.bookmark.create({
            data: {
                ...bookmarkDto,
                userId,
            },
        });

        return {
            bookmark,
            message: 'Bookmark created successfully',
        }
    }

    // service method to get a bookmark by id
    async getBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId
            },
        });

        if (!bookmark) {
            return 'Bookmark not found'
        }

        return bookmark;
    }

    // service method to update a bookmark
    async updateBookmark(userId: number, bookmarkId: number, bookmarkDto: BookmarkDto) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId
            },
        });

        if (!bookmark) {
            return 'Bookmark not found';
        }

        const updatedBookmark = await this.prismaService.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: bookmarkDto

        });

        return updatedBookmark;
    }

    // service method to delete a bookmark
    async deleteBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId
            },
        });

        if (!bookmark) {
            return 'Bookmark not found'
        }

        await this.prismaService.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });

        return { message: 'Bookmark deleted successfully' };
    }

}
