import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  Check,
  LogIn,
  LogOut,
  Send,
  Trash2,
  ArrowRight,
  Building2,
  MapPin,
  FileText,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Clock,
  ClipboardList,
  Mail,
  Phone,
} from "lucide-react";
import PageHero from "../../components/PageHero/PageHero";
import AuthModal from "../../components/AuthModal/AuthModal";
import OrderStatusModal from "../../components/OrderStatusModal/OrderStatusModal";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiClient";
import styles from "./PurchaseOrderPage.module.css";

// Format price in INR
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const INACTIVE_ORDER_MESSAGE =
  "You cannot place order, contact support team";

export default function PurchaseOrderPage() {
  const { user, profile, isAuthenticated, isCustomer, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Cart state
  const [cart, setCart] = useState([]); // { product, qty, unitPrice }
  const [notes, setNotes] = useState("");
  const [qtyInputs, setQtyInputs] = useState({}); // product_id -> qty string

  // Feedback
  const [addedProductId, setAddedProductId] = useState(null);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Mobile cart drawer
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // ===== Fetch pending orders count =====
  useEffect(() => {
    if (!user) {
      setPendingOrdersCount(0);
      return;
    }

    async function fetchPendingCount() {
      try {
        const { orders = [] } = await apiRequest("/api/orders");
        const count = orders.filter(
          (o) => (o.status || "pending").toLowerCase() === "pending"
        ).length;
        setPendingOrdersCount(count);
      } catch (err) {
        console.error("Error checking pending orders:", err);
      }
    }

    fetchPendingCount();
  }, [user]);

  // ===== Fetch products + prices + categories =====
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [{ categories: categoryList = [] }, { products: productList = [] }] =
          await Promise.all([
            apiRequest("/api/products/categories"),
            apiRequest("/api/products"),
          ]);
        setCategories(categoryList);
        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ===== Filtered products =====
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category_id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  // ===== Cart helpers =====
  const addToCart = useCallback(
    (product) => {
      const rawQty = qtyInputs[product.id];
      const qty = parseFloat(rawQty) || product.minimum_order_qty;

      if (qty < product.minimum_order_qty) return;
      if (product.currentPrice === null) return;

      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, qty: item.qty + qty }
              : item,
          );
        }
        return [
          ...prev,
          {
            product,
            qty,
            unitPrice: parseFloat(product.currentPrice),
          },
        ];
      });

      // Show feedback
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1200);
    },
    [qtyInputs],
  );

  const updateCartQty = useCallback((productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        const newQty = Math.max(
          item.product.minimum_order_qty,
          item.qty + delta,
        );
        return { ...item, qty: newQty };
      }),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [cart],
  );

  const cartItemCount = cart.length;

  // ===== Open Checkout Modal =====
  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (cart.length === 0) return;
    setShowCheckoutModal(true);
  };

  // ===== Submit order through the API =====
  const handleFinalSubmitOrder = async (companyData) => {
    if (!isAuthenticated || cart.length === 0) return;

    setSubmitting(true);
    try {
      const { profile: currentProfile } = await apiRequest("/api/profile");

      if (
        (currentProfile?.status || profile?.status || "").toLowerCase() !==
        "active"
      ) {
        alert(INACTIVE_ORDER_MESSAGE);
        return;
      }

      const companyPayload = {
        company_name: companyData.company_name.trim(),
        email: companyData.email.trim(),
        phone_number: companyData.phone_number.trim(),
        tax_number: companyData.tax_number.trim() || null,
        billing_address: companyData.billing_address.trim(),
        shipping_address: companyData.shipping_address.trim(),
        city: companyData.city.trim(),
        state: companyData.state.trim(),
        country: companyData.country.trim() || "India",
        postal_code: companyData.postal_code.trim(),
      };

      const subtotal = cartSubtotal;
      const orderNotes = companyData.notes
        ? companyData.notes.trim()
        : notes.trim() || null;

      const { order } = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.product.id,
            requested_qty: item.qty,
          })),
          company: companyPayload,
          notes: orderNotes,
        }),
      });
      const orderNumber = order.order_number;
      const total = Number(order.total_amount ?? subtotal);

      setSuccessOrder({
        orderNumber,
        total,
        companyName: companyPayload.company_name,
        email: companyPayload.email,
        phoneNumber: companyPayload.phone_number,
        taxNumber: companyPayload.tax_number,
        shippingAddress: `${companyPayload.shipping_address}, ${companyPayload.city}, ${companyPayload.state}, ${companyPayload.country} - ${companyPayload.postal_code}`,
        itemCount: cart.length,
      });
      setPendingOrdersCount((prev) => prev + 1);
      setCart([]);
      setNotes("");
      setShowCheckoutModal(false);
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Failed to submit order: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Current step =====
  const currentStep = successOrder ? 3 : cart.length > 0 ? 2 : 1;

  // ===== Success screen overlay =====
  if (successOrder) {
    return (
      <div className={styles.pageContainer}>
        <PageHero
          title="Purchase Order"
          subtitle="Submit your order request"
          breadcrumbs={[{ label: "Purchase Order" }]}
        />
        <div className={styles.container}>
          <StepsBar current={3} />
          <div className={styles.successOverlay}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className={styles.successTitle}>Order request submitted</h2>
              <div className={styles.successOrderNumber}>
                {successOrder.orderNumber}
              </div>
              <p className={styles.successMessage}>
                Your purchase order request for{" "}
                <strong>{successOrder.companyName}</strong> has been submitted
                successfully. A confirmation email has been sent to{" "}
                <strong>{successOrder.email}</strong>. Our team will review and process it
                shortly.
              </p>

              <div className={styles.successDetailsSummary}>
                <div className={styles.summaryItem}>
                  <Building2 size={16} />
                  <span>
                    <strong>Company:</strong> {successOrder.companyName}{" "}
                    {successOrder.taxNumber
                      ? `(GST/Tax: ${successOrder.taxNumber})`
                      : ""}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <Mail size={16} />
                  <span>
                    <strong>Confirmation Email:</strong> {successOrder.email}
                  </span>
                </div>
                {successOrder.phoneNumber && (
                  <div className={styles.summaryItem}>
                    <Phone size={16} />
                    <span>
                      <strong>Phone:</strong> {successOrder.phoneNumber}
                    </span>
                  </div>
                )}
                <div className={styles.summaryItem}>
                  <MapPin size={16} />
                  <span>
                    <strong>Deliver To:</strong> {successOrder.shippingAddress}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <ShoppingBag size={16} />
                  <span>
                    <strong>Total Items:</strong> {successOrder.itemCount}{" "}
                    item(s)
                  </span>
                </div>
              </div>

              <div className={styles.successActions}>
                <button
                  className={`${styles.successBtn} ${styles.successBtnPrimary}`}
                  onClick={() => setSuccessOrder(null)}>
                  Place Another Order
                </button>
                <button
                  className={`${styles.successBtn} ${styles.successBtnSecondary}`}
                  onClick={() => {
                    setSuccessOrder(null);
                    setShowOrdersModal(true);
                  }}>
                  <Clock size={16} />
                  Track Order Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Modal in Success View */}
        <OrderStatusModal
          isOpen={showOrdersModal}
          onClose={() => setShowOrdersModal(false)}
          user={user}
          onOrderCountChange={setPendingOrdersCount}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHero
        title="Purchase Order"
        subtitle="Browse products and submit your order request"
        breadcrumbs={[{ label: "Purchase Order" }]}
      />

      <div className={styles.container}>
        <StepsBar current={currentStep} />

        {/* Auth Prompt */}
        {!isAuthenticated && (
          <div className={styles.authPrompt}>
            <div className={styles.authPromptIcon}>
              <LogIn size={32} />
            </div>
            <h3 className={styles.authPromptTitle}>Login Required</h3>
            <p className={styles.authPromptText}>
              Sign in or create an account to browse our catalog and place your
              purchase order request.
            </p>
            <button
              className={styles.authPromptBtn}
              onClick={() => setShowAuthModal(true)}>
              <LogIn size={18} />
              Sign In to Continue
            </button>
          </div>
        )}

        {/* Authenticated content */}
        {isAuthenticated && (
          <>
            {/* User Info Bar */}
            <div className={styles.userInfoBar}>
              <div className={styles.userInfoLeft}>
                <div className={styles.userAvatar}>
                  {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>
                    {profile?.full_name || "Welcome back"}
                  </span>
                  <span className={styles.userEmail}>{user?.email}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={async () => { await signOut(); }}
                title="Sign out of your account"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>

          <div className={styles.pageLayout}>
            {/* Product Catalog */}
            <div className={styles.catalogSection}>
              <div className={styles.catalogHeader}>
                <div className={styles.catalogHeaderTitle}>
                  <h2>Product Catalog</h2>
                  <span className={styles.productCount}>
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.ordersStatusBtn}
                  onClick={() => setShowOrdersModal(true)}
                  title="View my submitted purchase orders and approval status"
                >
                  <Clock size={16} />
                  <span>My Order Requests</span>
                  {pendingOrdersCount > 0 ? (
                    <span className={styles.pendingBadge}>
                      {pendingOrdersCount} Pending
                    </span>
                  ) : (
                    <span className={styles.viewHistoryBadge}>View Status</span>
                  )}
                </button>
              </div>

              <div className={styles.searchAndFilter}>
                <div className={styles.searchBox}>
                  <Search className={styles.searchIcon} size={18} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by name, SKU, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className={styles.categoryFilters}>
                  <button
                    className={`${styles.filterChip} ${activeCategory === "all" ? styles.filterChipActive : ""}`}
                    onClick={() => setActiveCategory("all")}>
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`${styles.filterChip} ${activeCategory === cat.id ? styles.filterChipActive : ""}`}
                      onClick={() => setActiveCategory(cat.id)}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className={styles.emptyProducts}>
                  <Package size={48} />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className={styles.productsGrid}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      {addedProductId === product.id && (
                        <span className={styles.addedFeedback}>✓ Added!</span>
                      )}

                      <div className={styles.productImageWrapper}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={styles.productImage}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={styles.productImagePlaceholder}
                          style={{
                            display: product.imageUrl ? "none" : "flex",
                          }}>
                          <Package
                            size={36}
                            className={styles.placeholderIcon}
                          />
                        </div>
                      </div>

                      <div className={styles.productCardHeader}>
                        <span className={styles.productName}>
                          {product.name}
                        </span>
                        <span className={styles.productSku}>{product.sku}</span>
                      </div>

                      <div className={styles.productMeta}>
                        <span className={styles.metaTag}>
                          {product.unit_of_measure}
                        </span>
                        <span className={styles.metaTag}>
                          Min: {product.minimum_order_qty}
                        </span>
                      </div>

                      <div className={styles.productActions}>
                        <input
                          type="number"
                          className={styles.qtyInput}
                          min={product.minimum_order_qty}
                          step="1"
                          placeholder={String(product.minimum_order_qty)}
                          value={qtyInputs[product.id] ?? ""}
                          onChange={(e) =>
                            setQtyInputs((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className={styles.addToCartBtn}
                          disabled={product.currentPrice === null}
                          onClick={() => addToCart(product)}
                          title="Get Quotation">
                          <FileText size={16} />
                          Get Quotation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Cart Sidebar */}
            <CartPanel
              cart={cart}
              notes={notes}
              setNotes={setNotes}
              cartSubtotal={cartSubtotal}
              cartItemCount={cartItemCount}
              updateCartQty={updateCartQty}
              removeFromCart={removeFromCart}
              onProceedToSubmit={handleOpenCheckout}
              submitting={submitting}
              isCustomer={isCustomer}
              className={styles.cartSidebar}
            />
          </div>
          </>
        )}
      </div>

      {/* Mobile Cart FAB */}
      {isAuthenticated && cartItemCount > 0 && (
        <button
          className={styles.mobileCartToggle}
          onClick={() => setMobileCartOpen(true)}
          aria-label="Open cart">
          <ShoppingCart size={24} />
          <span className={styles.cartFabBadge}>{cartItemCount}</span>
        </button>
      )}

      {/* Mobile Cart Drawer Backdrop */}
      {mobileCartOpen && (
        <div
          className={`${styles.drawerBackdrop} ${styles.drawerBackdropOpen}`}
          onClick={() => setMobileCartOpen(false)}
        />
      )}

      {/* Mobile Cart Drawer */}
      {isAuthenticated && (
        <div
          className={`${styles.mobileCartDrawer} ${mobileCartOpen ? styles.mobileCartDrawerOpen : ""}`}>
          <div
            className={styles.drawerHandle}
            onClick={() => setMobileCartOpen(false)}
          />
          <CartPanel
            cart={cart}
            notes={notes}
            setNotes={setNotes}
            cartSubtotal={cartSubtotal}
            cartItemCount={cartItemCount}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
            onProceedToSubmit={() => {
              setMobileCartOpen(false);
              handleOpenCheckout();
            }}
            submitting={submitting}
            isCustomer={isCustomer}
          />
        </div>
      )}

      {/* Checkout / Company Details Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleFinalSubmitOrder}
        submitting={submitting}
        cartSubtotal={cartSubtotal}
        cartItemCount={cartItemCount}
        notes={notes}
        user={user}
      />

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
        user={user}
        onOrderCountChange={setPendingOrdersCount}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

/* ===== Steps Bar Component ===== */
function StepsBar({ current }) {
  const steps = [
    { num: 1, label: "Browse" },
    { num: 2, label: "Review Cart" },
    { num: 3, label: "Confirmed" },
  ];

  return (
    <div className={styles.stepsBar}>
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div
            className={`${styles.step} ${
              current === step.num
                ? styles.stepActive
                : current > step.num
                  ? styles.stepCompleted
                  : ""
            }`}>
            <div className={styles.stepNumber}>
              {current > step.num ? <Check size={16} /> : step.num}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`${styles.stepLine} ${current > step.num ? styles.stepLineCompleted : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ===== Cart Panel Component ===== */
function CartPanel({
  cart,
  notes,
  setNotes,
  cartSubtotal,
  cartItemCount,
  updateCartQty,
  removeFromCart,
  onProceedToSubmit,
  submitting,
  isCustomer,
  className,
}) {
  return (
    <div className={className || ""}>
      <div className={styles.cartHeader}>
        <h3 className={styles.cartTitle}>
          <ShoppingCart size={20} />
          Your Order
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </h3>
      </div>

      {cart.length === 0 ? (
        <div className={styles.cartEmpty}>
          <ShoppingCart size={40} className={styles.cartEmptyIcon} />
          <p>Your cart is empty</p>
          <p style={{ fontSize: "0.75rem", marginTop: "4px" }}>
            Browse and add products to get started
          </p>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.product.id} className={styles.cartItem}>
                {item.product.imageUrl && (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className={styles.cartItemThumb}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemName}>{item.product.name}</div>
                  <div className={styles.cartItemPrice}>
                    {item.product.unit_of_measure ? `${item.product.unit_of_measure} • ` : ""}Min: {item.product.minimum_order_qty}
                  </div>
                </div>
                <div className={styles.cartItemRight}>
                  <div className={styles.cartItemQty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateCartQty(item.product.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span className={styles.qtyValue}>{item.qty}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateCartQty(item.product.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Items</span>
              <span className={styles.summaryValue}>
                {cartItemCount} product{cartItemCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Quantity</span>
              <span className={styles.summaryValue}>
                {cart.reduce((sum, item) => sum + item.qty, 0)}{" "}
                units
              </span>
            </div>
            <div className={styles.quotationNotice}>
              Price quotation will be provided upon review of your request.
            </div>
          </div>

          <div className={styles.notesGroup}>
            <label className={styles.notesLabel} htmlFor="order-notes">
              Order Notes (optional)
            </label>
            <textarea
              id="order-notes"
              className={styles.notesInput}
              placeholder="Special instructions, delivery preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          {!isCustomer && (
            <div className={styles.notCustomerNotice}>
              {INACTIVE_ORDER_MESSAGE}
            </div>
          )}

          <button
            className={styles.submitOrderBtn}
            onClick={onProceedToSubmit}
            disabled={submitting}>
            <Send size={18} />
            Submit Order
          </button>
        </>
      )}
    </div>
  );
}

/* ===== Checkout / Company & Address Modal Component ===== */
function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  cartSubtotal,
  cartItemCount,
  notes,
  user,
}) {
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone_number: "",
    tax_number: "",
    billing_address: "",
    shipping_address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    notes: notes || "",
  });

  const [sameAddress, setSameAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Sync notes prop if changed
  useEffect(() => {
    if (notes) {
      setForm((f) => ({ ...f, notes }));
    }
  }, [notes]);

  // Fetch the current profile on modal open for contact defaults.
  useEffect(() => {
    if (isOpen && user) {
      async function loadCompanyInfo() {
        setLoadingCompany(true);
        try {
          const { profile } = await apiRequest("/api/profile");
          setForm((prev) => ({
            ...prev,
            email: prev.email || profile?.email || user?.email || "",
            phone_number:
              prev.phone_number ||
              profile?.phone ||
              user?.user_metadata?.phone ||
              user?.phone ||
              "",
          }));
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoadingCompany(false);
        }
      }

      loadCompanyInfo();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (sameAddress && name === "billing_address") {
        next.shipping_address = value;
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleToggleSameAddress = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, shipping_address: prev.billing_address }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.company_name.trim())
      errs.company_name = "Company name is required";
    if (!form.email.trim()) {
      errs.email = "Billing & confirmation email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.phone_number.trim()) {
      errs.phone_number = "Contact phone number is required";
    } else if (form.phone_number.trim().length < 7) {
      errs.phone_number = "Please enter a valid phone number";
    }
    if (!form.billing_address.trim())
      errs.billing_address = "Billing address is required";
    if (!sameAddress && !form.shipping_address.trim()) {
      errs.shipping_address = "Shipping address is required";
    }
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.country.trim()) errs.country = "Country is required";
    if (!form.postal_code.trim()) errs.postal_code = "Postal code is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const finalForm = {
      ...form,
      shipping_address: sameAddress
        ? form.billing_address
        : form.shipping_address,
    };
    onSubmit(finalForm);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.checkoutModalCard}
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              <Building2 className={styles.titleIcon} size={22} />
              Company & Delivery Details
            </h3>
            <p className={styles.modalSubtitle}>
              Please enter your business details to complete your order
              submission.
            </p>
          </div>
          <button
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {loadingCompany ? (
          <div className={styles.modalLoading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading saved company information...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formGrid}>
              {/* Company Name */}
              <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                <label className={styles.formLabel}>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Building2 className={styles.inputIcon} size={18} />
                  <input
                    type="text"
                    name="company_name"
                    className={`${styles.formInput} ${errors.company_name ? styles.inputError : ""}`}
                    placeholder="e.g. Acme Constructions Pvt Ltd"
                    value={form.company_name}
                    onChange={handleChange}
                  />
                </div>
                {errors.company_name && (
                  <span className={styles.errorText}>
                    {errors.company_name}
                  </span>
                )}
              </div>

              {/* Billing Email */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Confirmation Email <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input
                    type="email"
                    name="email"
                    className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
                    placeholder="e.g. purchasing@acme.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>

              {/* Contact Phone */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Phone Number <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Phone className={styles.inputIcon} size={18} />
                  <input
                    type="tel"
                    name="phone_number"
                    className={`${styles.formInput} ${errors.phone_number ? styles.inputError : ""}`}
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone_number}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone_number && (
                  <span className={styles.errorText}>{errors.phone_number}</span>
                )}
              </div>

              {/* Tax / GST Number (Optional) */}
              <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                <label className={styles.formLabel}>
                  Tax / GST Number{" "}
                  <span className={styles.optional}>(Optional)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <FileText className={styles.inputIcon} size={18} />
                  <input
                    type="text"
                    name="tax_number"
                    className={styles.formInput}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={form.tax_number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                <label className={styles.formLabel}>
                  Billing Address <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MapPin className={styles.inputIcon} size={18} />
                  <textarea
                    name="billing_address"
                    className={`${styles.formInput} ${styles.textareaInput} ${errors.billing_address ? styles.inputError : ""}`}
                    placeholder="Plot / Street / Area details..."
                    value={form.billing_address}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
                {errors.billing_address && (
                  <span className={styles.errorText}>
                    {errors.billing_address}
                  </span>
                )}
              </div>

              {/* Same address checkbox */}
              <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={handleToggleSameAddress}
                    className={styles.checkboxInput}
                  />
                  <span>Shipping address is same as billing address</span>
                </label>
              </div>

              {/* Shipping Address (if not same) */}
              {!sameAddress && (
                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                  <label className={styles.formLabel}>
                    Shipping Address <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <Truck className={styles.inputIcon} size={18} />
                    <textarea
                      name="shipping_address"
                      className={`${styles.formInput} ${styles.textareaInput} ${errors.shipping_address ? styles.inputError : ""}`}
                      placeholder="Delivery site or office address..."
                      value={form.shipping_address}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                  {errors.shipping_address && (
                    <span className={styles.errorText}>
                      {errors.shipping_address}
                    </span>
                  )}
                </div>
              )}

              {/* City */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  City <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className={`${styles.formInput} ${errors.city ? styles.inputError : ""}`}
                  placeholder="e.g. Mumbai"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <span className={styles.errorText}>{errors.city}</span>
                )}
              </div>

              {/* State */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  State <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  className={`${styles.formInput} ${errors.state ? styles.inputError : ""}`}
                  placeholder="e.g. Maharashtra"
                  value={form.state}
                  onChange={handleChange}
                />
                {errors.state && (
                  <span className={styles.errorText}>{errors.state}</span>
                )}
              </div>

              {/* Country */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Country <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  className={`${styles.formInput} ${errors.country ? styles.inputError : ""}`}
                  placeholder="e.g. India"
                  value={form.country}
                  onChange={handleChange}
                />
                {errors.country && (
                  <span className={styles.errorText}>{errors.country}</span>
                )}
              </div>

              {/* Postal Code */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Postal Code <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="postal_code"
                  className={`${styles.formInput} ${errors.postal_code ? styles.inputError : ""}`}
                  placeholder="e.g. 400001"
                  value={form.postal_code}
                  onChange={handleChange}
                />
                {errors.postal_code && (
                  <span className={styles.errorText}>{errors.postal_code}</span>
                )}
              </div>

              {/* Order Notes */}
              <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                <label className={styles.formLabel}>
                  Order Notes{" "}
                  <span className={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  className={styles.formInput}
                  placeholder="Additional instructions or delivery timing..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>

            {/* Summary Bar inside Modal */}
            <div className={styles.modalSummaryBar}>
              <div>
                <span className={styles.summaryBarText}>
                  {cartItemCount} item(s) selected
                </span>
                <div className={styles.summaryBarTotal}>
                  Quotation Request
                </div>
              </div>
              <div className={styles.modalFooterBtns}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onClose}
                  disabled={submitting}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.confirmSubmitBtn}
                  disabled={submitting}>
                  {submitting ? (
                    <>
                      <div
                        className={styles.loadingSpinner}
                        style={{ width: 18, height: 18, borderWidth: 2 }}
                      />
                      Submitting Order...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Confirm & Submit Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
