import { createContext, useContext, useState, ReactNode } from 'react';
import { UserState, UserActions } from '../types/user';
import { toast } from 'sonner';

interface UserContextType extends UserState, UserActions {}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialState: UserState = {
  isLoggedIn: false,
  userName: '',
  userId: '',
  bookmarkedPaperIds: [8, 9, 10, 11, 12, 13, 14], // 초기 북마크 데이터
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(initialState);

  const toggleBookmark = (paperId: number) => {
    if (!user.isLoggedIn) {
      toast.error('로그인이 필요합니다', {
        description: '북마크 기능을 사용하려면 로그인해주세요.',
      });
      return;
    }

    setUser((prev) => {
      const isBookmarked = prev.bookmarkedPaperIds.includes(paperId);
      const newBookmarkedIds = isBookmarked
        ? prev.bookmarkedPaperIds.filter((id) => id !== paperId)
        : [...prev.bookmarkedPaperIds, paperId];

      toast.success(isBookmarked ? '북마크가 해제되었습니다' : '내 서재에 추가되었습니다');

      return { ...prev, bookmarkedPaperIds: newBookmarkedIds };
    });
  };

  const login = (userName: string, userId: string) => {
    setUser({
      isLoggedIn: true,
      userName,
      userId,
      bookmarkedPaperIds: user.bookmarkedPaperIds,
    });
  };

  const logout = () => {
    setUser(initialState);
  };

  const updateUser = (updates: Partial<UserState>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider
      value={{
        ...user,
        toggleBookmark,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
}

