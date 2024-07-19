export type LoginType = {
  username: string;
  password: string;
};


export type RegisterType = {
  name: string,
  username: string,
  password: string,
  bio: string,
  avatar: string
}

export type userSliceState = {
  user: {
    token?: string
    userInfo: {
      username: string;
      _id: string;
      avatar: string;
    }
  }
}
