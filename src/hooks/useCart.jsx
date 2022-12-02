import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addOrUpdateToCart,
  getProductsFromCart,
  removeFromCart,
} from '../api/firebase';
import { useAuthContext } from '../context/AuthContext';

export default function useCart() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const cartQuery = useQuery(
    ['carts', uid || ''],
    () => getProductsFromCart(uid),
    {
      enabled: !!uid,
    }
  );

  const addOrUpdateItem = useMutation(
    (product) => addOrUpdateToCart(uid, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['carts', uid]);
      },
    }
  );

  const removeItem = useMutation((id) => removeFromCart(uid, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['carts', uid]);
    },
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
