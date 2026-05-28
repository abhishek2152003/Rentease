import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCartQuery, useSyncCartMutation } from '../redux/slices/cartApiSlice';
import { addToCart, clearCartItems } from '../redux/slices/cartSlice';

const CartSyncer = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    
    const [syncCart] = useSyncCartMutation();
    const { data: serverCart, isSuccess } = useGetCartQuery(undefined, { skip: !userInfo });
    const isFirstLoad = useRef(true);

    // When server cart is successfully fetched for the first time
    useEffect(() => {
        if (userInfo && isSuccess && serverCart && isFirstLoad.current) {
            if (serverCart.cartItems?.length > 0) {
                // If local cart is empty but server has items, pull them down
                if (cartItems.length === 0) {
                    serverCart.cartItems.forEach(item => dispatch(addToCart(item)));
                } else {
                    // If local cart has items, we probably want to sync them UP 
                    // rather than overwriting with server state unless they conflict.
                    // For simplicity in this demo, let's sync up by triggering mutation.
                    syncCart({ cartItems });
                }
            }
            isFirstLoad.current = false;
        }
    }, [userInfo, isSuccess, serverCart, cartItems.length, dispatch, syncCart]);

    // Whenever local cart changes, push to server (if logged in and after init)
    useEffect(() => {
        if (userInfo && !isFirstLoad.current) {
            syncCart({ cartItems });
        }
    }, [cartItems, userInfo, syncCart]);

    // If user logs out, reset first load flag
    useEffect(() => {
        if (!userInfo) {
            isFirstLoad.current = true;
        }
    }, [userInfo]);

    return null;
};

export default CartSyncer;
