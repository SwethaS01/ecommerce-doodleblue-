
function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
}) {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-btn"
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="quantity-value">{quantity}</span>

      <button
        type="button"
        className="quantity-btn"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
