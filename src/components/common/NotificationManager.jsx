import React from 'react';
import { useSnackbar } from 'notistack';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeNotification } from '../../store/slices/uiSlice';

const NotificationManager = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  // Track displayed notifications to avoid duplicates
  const [displayedNotifications, setDisplayedNotifications] = React.useState(new Set());

  React.useEffect(() => {
    notifications.forEach((notification) => {
      // Skip if already displayed
      if (displayedNotifications.has(notification.id)) {
        return;
      }

      // Add to displayed set
      setDisplayedNotifications((prev) => new Set(prev).add(notification.id));

      // Show notification
      const snackbarId = enqueueSnackbar(notification.message, {
        variant: notification.type,
        autoHideDuration: notification.autoHideDuration || 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        onExited: () => {
          // Remove from Redux store when snackbar is closed
          dispatch(removeNotification(notification.id));
          // Remove from displayed set
          setDisplayedNotifications((prev) => {
            const newSet = new Set(prev);
            newSet.delete(notification.id);
            return newSet;
          });
        },
        action: notification.action,
        persist: notification.persist || false,
      });

      // Store snackbar ID for potential manual closing
      if (notification.persist) {
        notification.snackbarId = snackbarId;
      }
    });
  }, [notifications, enqueueSnackbar, dispatch, displayedNotifications]);

  return null; // This component doesn't render anything
};

export default NotificationManager;