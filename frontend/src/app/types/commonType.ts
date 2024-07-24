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


export type serachUserType = {
  _id: string,
  name: string,
  username: string,
  requestId: string,
  avatar: {
    url: ""
  },
  status: boolean,
  pendingFromOurSide: boolean,

}

export type searchUserPayloadType = {
  search?: string | number,
  pageNumber: number,
  pageSize: number
}

type PageNameType = "searchUserPage" | "requestPage";
export type userListPropsType = {
  pageName: PageNameType,
  buttonName: string,
  pageHeading: string
}


export type friendRequestType = {
  _id: string,
  sender: {
    name: string,
    sender_id: string
    username: string,
    avatar: {
      url: string
      public_id: string
    }
  }
}


export type requestAcceptRejectPayloadType = {
  requestId: string,
  status: boolean
}


export type paginDataType = {
  data: any,
  totalCount: number,
}

export type sidebarFriendsType = {
  _id: string,
  friend: {
    _id: string,
    name: string,
    username: string,
    avatar: {
      url: string
    }
  }
}
