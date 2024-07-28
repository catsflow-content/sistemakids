//* Função para fechar e cancelar lógica do toast
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const cancelDeleteToast = (
  setItemToDelete: SetState<any>,
  setShowDeleteToast: SetState<boolean>
) => {
  setItemToDelete(null);
  setShowDeleteToast(false);
};
