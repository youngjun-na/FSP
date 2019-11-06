export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";

export const openModal = (modal, paramId) => {

  return {
    type: OPEN_MODAL,
    modal: [modal, paramId]
  }
};

export const closeModal = () => ({
  type: CLOSE_MODAL,
});