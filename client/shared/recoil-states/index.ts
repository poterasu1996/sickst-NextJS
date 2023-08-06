import { atom } from 'recoil';
import { IUserModel } from '../../models/User.model';
import { IShippingInfo } from '../../models/ShippingInformation.model';

export const shippingListR = atom<IShippingInfo[] | null>({
    key: 'shippingListR',
    default:  null
})

export const userStateRecoil = atom<IUserModel | null>({
    key: 'userState',
    default: null
});