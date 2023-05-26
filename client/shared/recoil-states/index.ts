import { atom } from 'recoil';
import { IUserModel } from '../../models/User.model';

export const userStateRecoil = atom<IUserModel | null>({
    key: 'userState',
    default: null
});