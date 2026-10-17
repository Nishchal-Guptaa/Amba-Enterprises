import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  Calendar,
  IndianRupee,
  Search,
  Truck,
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import styles from './OrderStatusModal.module.css';

// Format currency
function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    colorClass: styles.statusPending,
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    description: 'Your purchase order has been submitted and is awaiting review from Amba Enterprises.',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    colorClass: styles.statusApproved,
    badgeBg: '#E0E7FF',
    badgeColor: '#3730A3',
    description: 'Your order has been verified and approved for processing.',
  },
  processing: {
    label: 'Processing',
    icon: Package,
    colorClass: styles.statusProcessing,
    badgeBg: '#DBEAFE',
    badgeColor: '#1E40AF',
    description: 'Your items are being prepared and packaged for dispatch.',
  },
  shipped: {
    label: 'Dispatched / In Transit',
    icon: Truck,
    colorClass: styles.statusShipped,
    badgeBg: '#E0F2FE',
    badgeColor: '#0369A1',
    description: 'Your consignment has been dispatched for delivery.',
  },
  completed: {
    label: 'Completed / Delivered',
    icon: CheckCircle,
    colorClass: styles.statusCompleted,
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    description: 'Order successfully delivered and fulfilled.',
  },
  cancelled: {
    label: 'Cancelled / Rejected',
    icon: XCircle,
    colorClass: styles.statusCancelled,
    badgeBg: '#FEE2E2',
    badgeColor: '#991B1B',
    description: 'This purchase order request was cancelled or declined.',
  },
};

export default function OrderStatusModal({ isOpen, onClose, user, onOrderCountChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'active' | 'completed' | 'cancelled'
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!user) return;
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setLoadError('');

    try {
      const { orders: orderList = [] } = await apiRequest('/api/orders');
      setOrders(orderList);

      // Notify parent of pending count if callback provided
      if (onOrderCountChange) {
        const pendingCount = orderList.filter((o) => (o.status || 'pending').toLowerCase() === 'pending').length;
        onOrderCountChange(pendingCount);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoadError(err.message || 'Could not load your order history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, onOrderCountChange]);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user, fetchOrders]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      const status = (o.status || 'pending').toLowerCase();
      if (status === 'pending') {
        counts.pending++;
      } else if (status === 'approved' || status === 'processing' || status === 'shipped') {
        counts.active++;
      } else if (status === 'completed' || status === 'delivered') {
        counts.completed++;
      } else if (status === 'cancelled' || status === 'rejected') {
        counts.cancelled++;
      }
    });

    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.status || 'pending').toLowerCase();

      // Tab filter
      let matchesTab = true;
      if (activeTab === 'pending') {
        matchesTab = status === 'pending';
      } else if (activeTab === 'active') {
        matchesTab = ['approved', 'processing', 'shipped'].includes(status);
      } else if (activeTab === 'completed') {
        matchesTab = ['completed', 'delivered'].includes(status);
      } else if (activeTab === 'cancelled') {
        matchesTab = ['cancelled', 'rejected'].includes(status);
      }

      if (!matchesTab) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = order.order_number?.toLowerCase().includes(q);
        const matchesNotes = order.notes?.toLowerCase().includes(q);
        const matchesItem = order.order_items?.some(
          (item) =>
            item.product_name_snapshot?.toLowerCase().includes(q) ||
            item.sku_snapshot?.toLowerCase().includes(q)
        );
        return matchesNum || matchesNotes || matchesItem;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Clock size={24} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>My Purchase Order Requests</h2>
              <p className={styles.modalSubtitle}>
                Track live status and order history for your submitted purchase orders
              </p>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button
              className={`${styles.refreshBtn} ${refreshing ? styles.refreshSpin : ''}`}
              onClick={() => fetchOrders(true)}
              disabled={refreshing || loading}
              title="Refresh order statuses"
            >
              <RefreshCw size={17} />
              <span>Refresh</span>
            </button>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs & Search */}
        <div className={styles.toolbar}>
          <div className={styles.tabsWrapper}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Orders
              <span className={styles.tabBadge}>{tabCounts.all}</span>
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Review
              {tabCounts.pending > 0 && (
                <span className={`${styles.tabBadge} ${styles.tabBadgePending}`}>
                  {tabCounts.pending}
                </span>
              )}
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              In Progress
              <span className={styles.tabBadge}>{tabCounts.active}</span>
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
              <span className={styles.tabBadge}>{tabCounts.completed}</span>
            </button>
            {tabCounts.cancelled > 0 && (
              <button
                className={`${styles.tabBtn} ${activeTab === 'cancelled' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                Cancelled
                <span className={styles.tabBadge}>{tabCounts.cancelled}</span>
              </button>
            )}
          </div>

          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by order #, SKU or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Content / Orders List */}
        <div className={styles.ordersContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Fetching your purchase orders...</p>
            </div>
          ) : loadError ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <AlertCircle size={48} strokeWidth={1.5} />
              </div>
              <h3 className={styles.emptyTitle}>Unable to load order history</h3>
              <p className={styles.emptyText}>{loadError}</p>
              <button
                className={styles.emptyActionBtn}
                onClick={() => fetchOrders()}
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <h3 className={styles.emptyTitle}>
                {searchQuery
                  ? 'No matching orders found'
                  : activeTab === 'pending'
                  ? 'No pending order requests'
                  : 'No orders placed yet'}
              </h3>
              <p className={styles.emptyText}>
                {searchQuery
                  ? `Try clearing your search terms or selecting a different tab.`
                  : activeTab === 'pending'
                  ? 'All your purchase orders have been processed or fulfilled.'
                  : 'Browse our catalog and submit your first purchase order request.'}
              </p>
              {searchQuery && (
                <button
                  className={styles.emptyActionBtn}
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className={styles.orderList}>
              {filteredOrders.map((order) => {
                const statusKey = (order.status || 'pending').toLowerCase();
                const statusConf = STATUS_CONFIG[statusKey] || {
                  label: order.status || 'Unknown',
                  icon: HelpCircle,
                  badgeBg: '#F3F4F6',
                  badgeColor: '#4B5563',
                  description: 'Status update pending.',
                };
                const StatusIcon = statusConf.icon;
                const isExpanded = expandedOrderId === order.id;
                const itemsCount = order.order_items?.length || 0;

                return (
                  <div
                    key={order.id}
                    className={`${styles.orderCard} ${isExpanded ? styles.orderCardExpanded : ''}`}
                  >
                    {/* Main Order Row */}
                    <div
                      className={styles.orderCardMain}
                      onClick={() => toggleExpand(order.id)}
                    >
                      <div className={styles.orderHeaderLeft}>
                        <div className={styles.orderNumberRow}>
                          <span className={styles.orderNumber}>
                            {order.order_number}
                          </span>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: statusConf.badgeBg,
                              color: statusConf.badgeColor,
                            }}
                          >
                            <StatusIcon size={14} className={styles.statusIcon} />
                            {statusConf.label}
                          </span>
                        </div>

                        <div className={styles.orderMetaRow}>
                          <span className={styles.metaItem}>
                            <Calendar size={14} />
                            {formatDate(order.created_at)}
                          </span>
                          <span className={styles.metaDivider}>•</span>
                          <span className={styles.metaItem}>
                            <Package size={14} />
                            {itemsCount} line item{itemsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className={styles.orderHeaderRight}>
                        <div className={styles.orderAmount}>
                          <span className={styles.amountLabel}>Total Value</span>
                          <span className={styles.amountValue}>
                            ₹{formatPrice(order.total_amount || order.subtotal)}
                          </span>
                        </div>

                        <button
                          className={styles.expandToggleBtn}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Order Details */}
                    {isExpanded && (
                      <div className={styles.orderDetails}>
                        {/* Status Description Banner */}
                        <div className={styles.statusBanner}>
                          <StatusIcon size={18} className={styles.bannerIcon} />
                          <div className={styles.bannerText}>
                            <strong>Status Details:</strong> {statusConf.description}
                          </div>
                        </div>

                        {/* Order Items Table */}
                        <div className={styles.itemsTableWrapper}>
                          <h4 className={styles.sectionTitle}>
                            <Package size={16} />
                            Requested Items
                          </h4>
                          <table className={styles.itemsTable}>
                            <thead>
                              <tr>
                                <th>Item / SKU</th>
                                <th className={styles.textCenter}>Qty</th>
                                <th className={styles.textRight}>Unit Price</th>
                                <th className={styles.textRight}>Line Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items && order.order_items.length > 0 ? (
                                order.order_items.map((item) => (
                                  <tr key={item.id}>
                                    <td>
                                      <div className={styles.itemName}>
                                        {item.product_name_snapshot || 'Product Item'}
                                      </div>
                                      {item.sku_snapshot && (
                                        <div className={styles.itemSku}>
                                          SKU: {item.sku_snapshot}
                                        </div>
                                      )}
                                    </td>
                                    <td className={styles.textCenter}>
                                      <span className={styles.qtyBadge}>
                                        {item.requested_qty}
                                      </span>
                                    </td>
                                    <td className={styles.textRight}>
                                      ₹{formatPrice(item.unit_price_at_request)}
                                    </td>
                                    <td className={`${styles.textRight} ${styles.itemTotalCell}`}>
                                      ₹{formatPrice(item.line_total)}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className={styles.textCenter}>
                                    No item snapshots found for this order.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className={styles.textRight}>
                                  <strong>Order Total:</strong>
                                </td>
                                <td className={`${styles.textRight} ${styles.footTotal}`}>
                                  ₹{formatPrice(order.total_amount || order.subtotal)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Order Notes / Instructions if any */}
                        {order.notes && (
                          <div className={styles.notesSection}>
                            <div className={styles.notesTitle}>
                              <FileText size={14} />
                              <span>Order Notes & Delivery Instructions</span>
                            </div>
                            <p className={styles.notesBody}>{order.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerHelp}>
            <HelpCircle size={15} />
            <span>Need assistance with an existing order? Contact Amba support on WhatsApp.</span>
          </div>
          <button className={styles.doneBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}