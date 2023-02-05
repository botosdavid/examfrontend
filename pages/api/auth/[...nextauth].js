import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../prisma/lib/prismadb";
import bcrypt from 'bcrypt';

export const authOptions =  {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        neptun: { label: 'neptun', type: 'text', required: true },
        password: {label: 'password', type: 'password', required: true},
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const { neptun, password } = credentials;

        const user = await prisma.user.findFirst({ where: { neptun: neptun }});
        if(!user) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return null;

        return user // Any object returned will be saved in `user` property of the JWT
      }

    })
  ],
  
  secret: process.env.JWT_SECRET,
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   console.log('SignIn');
    //   // permission true/false
    //   return false;
    // },
    async session({ session, token, user }) {
      console.log('Session');
      session.user = token.user;
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('JWT');
      if (user) token.user = user;
      return token
    }

  }
}

export default NextAuth(authOptions);