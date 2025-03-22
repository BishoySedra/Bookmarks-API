import { Controller, Get, Post, Patch, Delete, UseGuards, Body, Param, ParseIntPipe } from '@nestjs/common';
import { jwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto';
import { User } from '../auth/decorator';

@UseGuards(jwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    // route to get all bookmarks
    @Get()
    getBookmarks(@User('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    // route to create a bookmark
    @Post()
    createBookmark(@User('id') userId: number, @Body() bookmarkDto: BookmarkDto) {
        return this.bookmarkService.createBookmark(userId, bookmarkDto);
    }

    // route to get a bookmark by id
    @Get(':id')
    getBookmark(@User('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmark(userId, bookmarkId);
    }

    // route to update a bookmark
    @Patch(':id')
    updateBookmark(@User('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() bookmarkDto: BookmarkDto) {
        return this.bookmarkService.updateBookmark(userId, bookmarkId, bookmarkDto);
    }

    // route to delete a bookmark
    @Delete(':id')
    deleteBookmark(@User('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }

}
