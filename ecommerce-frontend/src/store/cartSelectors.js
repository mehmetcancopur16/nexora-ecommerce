export function selectCartSubtotal(state) {
  const items = state.cart?.items || []
  return items.reduce((sum, item) => sum + Number(item?.product?.price || 0) * Number(item?.quantity || 0), 0)
}

export function selectCartItemCount(state) {
  const items = state.cart?.items || []
  return items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
}
