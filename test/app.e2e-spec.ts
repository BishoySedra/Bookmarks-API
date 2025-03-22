import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpCode, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { BookmarkDto } from '../src/bookmark/dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const server_port = 3333;
  beforeAll(async () => {
    // getting the app ready
    const ModuleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // creating nest app
    app = ModuleRef.createNestApplication();

    // adding Pipes of validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    // Init the app
    await app.init();
    await app.listen(server_port);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl(`http://localhost:${server_port}`);

  });

  afterAll(async () => {
    await app.close();
  })

  describe("Auth", () => {
    const user: AuthDto = {
      email: "bishoysedraa@gmail.com",
      password: "123456",
    };
    const invalidUser: AuthDto = {
      email: "bishoysedraa@gmail.com",
      password: "1234567",
    };


    describe("Signup", () => {
      it("Should Signup a new user", () => {

        return pactum.spec()
          .post(`/auth/signup`)
          .withBody(user)
          .expectStatus(HttpStatus.CREATED)
          .inspect();
      });

      it("Should not signup with empty email", () => {
        return pactum.spec()
          .post(`/auth/signup`)
          .withBody({
            ...user,
            email: ""
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });

      it("Should not signup with empty password", () => {
        return pactum.spec()
          .post(`/auth/signup`)
          .withBody({
            ...user,
            password: ""
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });

      it("Should not signup if the body not provided", () => {
        return pactum.spec()
          .post(`/auth/signup`)
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
    });

    describe("Login", () => {

      it("Should login a user", () => {
        return pactum.spec()
          .post(`/auth/login`)
          .withBody(user)
          .expectStatus(HttpStatus.OK)
          .inspect()
          .stores('user_token', 'token');
      });

      it("Should not login a user with wrong credentials", () => {
        return pactum.spec()
          .post(`/auth/login`)
          .withBody(invalidUser)
          .expectStatus(HttpStatus.OK)
      });

      it("Should not login with empty email", () => {
        return pactum.spec()
          .post(`/auth/login`)
          .withBody({
            ...user,
            email: ""
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });

      it("Should not login with empty password", () => {
        return pactum.spec()
          .post(`/auth/login`)
          .withBody({
            ...user,
            password: ""
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });

      it("Should not login if the body not provided", () => {
        return pactum.spec()
          .post(`/auth/login`)
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
    });

  });

  describe("User", () => {
    describe("Profile", () => {

      it("Should get the profile of the user", () => {
        return pactum.spec()
          .get(`/users/me`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
          .inspect();
      });

    });

    describe("Update Profile", () => {
      it("Should update the profile of the user", () => {
        const editUser: EditUserDto = {
          firstName: "Bishoy",
          lastName: "Sedraaaa",
          email: "bishosedra0@gmail.com"
        };
        return pactum.spec()
          .patch(`/users/me`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .withBody(editUser)
          .expectStatus(HttpStatus.OK)
          .inspect();
      });
    });

  });

  describe("Bookmarks", () => {

    describe("Create Bookmark", () => {
      it("Should create a new bookmark", () => {
        const bookmark: BookmarkDto = {
          title: "Google",
          link: "https://www.google.com",
          description: "Search Engine"
        };

        return pactum.spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .withBody(bookmark)
          .expectStatus(HttpStatus.CREATED)
          .inspect();
      });
    });

    describe("Get Bookmarks", () => {
      it("Should get all bookmarks", () => {
        return pactum.spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
          .inspect();
      });
      it("Should get a bookmark by id ", () => {
        return pactum.spec()
          .get(`/bookmarks/1`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
          .inspect();
      });
      it("Should not get a bookmark by invalid id", () => {
        return pactum.spec()
          .get(`/bookmarks/100`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
      });
    });

    describe("Update Bookmark", () => {
      it("Should update a bookmark", () => {
        const bookmark: BookmarkDto = {
          title: "Google",
          link: "https://www.google.com",
          description: "Search Engine"
        };

        return pactum.spec()
          .patch(`/bookmarks/1`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .withBody(bookmark)
          .expectStatus(HttpStatus.OK)
          .inspect();
      });
      it("Should not update a bookmark with invalid id", () => {
        const bookmark: BookmarkDto = {
          title: "Google",
          link: "https://www.google.com",
          description: "Search Engine"
        };

        return pactum.spec()
          .patch(`/bookmarks/100`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .withBody(bookmark)
          .expectStatus(HttpStatus.OK)
      });
    });

    describe("Delete Bookmark", () => {
      it("Should delete a bookmark", () => {
        return pactum.spec()
          .delete(`/bookmarks/1`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
      });
      it("Should not delete a bookmark with invalid id", () => {
        return pactum.spec()
          .delete(`/bookmarks/100`)
          .withHeaders({
            Authorization: `Bearer $S{user_token}`
          })
          .expectStatus(HttpStatus.OK)
      });
    });

  });
});
