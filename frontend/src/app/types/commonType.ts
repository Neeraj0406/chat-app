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


export type createNewGroupType = {
  avatar: File | string,
  name: string,
  members: string[]
}


export interface Avatar {
  url: string;
}

export interface Member {
  avatar: Avatar;
  _id: string;
  name: string;
  username: string;
}

export interface UserChatList {
  _id: string;
  name: string;
  groupChat: boolean;
  friendDetails?: Member[]
  avatar?: {
    public_id: string,
    url: string
  }
  creator?: string;
  lastMessage?: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}






export type chatDetailsType = {
  _id: string;
  name: string;
  groupChat: boolean;
  avatar?: {
    public_id: string,
    url: string
  }
  creator: string;
  members: Member[];
  createdAt: string; // or Date if you prefer to handle dates as Date objects
  updatedAt: string; // or Date
  __v: number;
}
// chatId, members, name, avatar

export type updateGroupType = {
  name: string,
  member: string[],
  chatId: string,
  avatar: string
}


export type userInfo = {
  avatar: {
    public_id: string,
    url: string,
  },
  _id: string,
  name: string,
}


export type MessageType = {
  _id: string,
  sender: userInfo,
  chatId: string,
  content: string,
  attachments?: string[],
  createdAt: string,
  updatedAt: string,
}