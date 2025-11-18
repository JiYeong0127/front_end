export interface UserState {
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  bookmarkedPaperIds: number[];
}

export interface UserActions {
  toggleBookmark: (paperId: number) => void;
  login: (userName: string, userId: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserState>) => void;
}

