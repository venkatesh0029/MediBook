# Troubleshooting Guide

## Common Issues and Solutions

### 1. Cannot Log In
**Problem:** Login fails with "Invalid credentials" or authentication error

**Solutions:**
- Ensure you've created sample data by clicking "Create Sample Data" on the auth page
- Double-check the email and password (they are case-sensitive)
- Try signing up as a new patient user
- Clear browser cache and local storage, then try again

### 2. No Doctors Showing Up
**Problem:** Patient dashboard shows "No doctors found"

**Solutions:**
- Make sure you've initialized sample data using the "Create Sample Data" button
- Check that you're logged in as a patient (not a doctor or admin)
- Refresh the page to reload data from the server

### 3. Cannot Book Appointments
**Problem:** Booking button is disabled or booking fails

**Solutions:**
- Ensure you're logged in as a patient
- Check that the doctor is marked as "Available"
- Make sure you've selected both a date and time slot
- Try selecting a future date (not today or past dates)

### 4. Appointment Not Showing in Dashboard
**Problem:** After booking, appointment doesn't appear

**Solutions:**
- Refresh the page
- Check your browser console for any error messages
- Log out and log back in
- Verify the appointment was created by logging in as admin

### 5. Doctor Profile Not Loading
**Problem:** Clicking on a doctor shows loading forever or error

**Solutions:**
- Ensure the doctor profile exists by checking admin dashboard
- Clear browser cache
- Check network tab in browser dev tools for API errors
- Verify you're still logged in (token may have expired)

### 6. Admin Dashboard Empty
**Problem:** Admin dashboard shows no users or data

**Solutions:**
- Verify you're logged in as admin (not patient or doctor)
- Initialize sample data if you haven't already
- Create some test accounts and appointments
- Check browser console for error messages

### 7. Page Not Found (404)
**Problem:** Navigating to certain pages shows 404

**Solutions:**
- Check that the URL is correct
- Ensure you're using the correct role-based URL:
  - Patients: `/patient/dashboard`
  - Doctors: `/doctor/dashboard`
  - Admins: `/admin/dashboard`
- Clear browser cache and refresh

### 8. Backend Connection Issues
**Problem:** "Failed to load dashboard" or connection errors

**Solutions:**
- Check that Supabase is properly connected
- Verify your internet connection
- Check browser console for specific error messages
- Ensure the Supabase project is active and not paused

### 9. Sample Data Button Not Working
**Problem:** "Create Sample Data" fails or doesn't respond

**Solutions:**
- Check browser console for error messages
- Ensure you have internet connection
- Try refreshing the page and clicking again
- The button becomes disabled after successful creation (it may already be created)

### 10. Cannot Update Doctor Profile
**Problem:** Doctor profile changes don't save

**Solutions:**
- Ensure you're logged in as a doctor
- Fill in all required fields (specialty, experience)
- Check for error messages after clicking "Save Changes"
- Refresh the page to see if changes were saved

## Browser Console

To view detailed error messages:
1. Press F12 (Windows/Linux) or Cmd+Option+I (Mac)
2. Click on the "Console" tab
3. Look for red error messages
4. Share these messages if seeking help

## Data Reset

To completely reset your test data:
1. Log in as admin
2. Note down any important test data
3. Contact your administrator to clear the database
4. Re-initialize sample data using "Create Sample Data"

## Best Practices for Testing

1. **Start Fresh:** Begin with sample data initialization
2. **Test Flow:** Patient → Browse → Book → Doctor → Manage → Admin → Overview
3. **Multiple Browsers:** Test different user roles in different browser tabs
4. **Realistic Data:** Use reasonable dates, times, and information
5. **Check All Roles:** Verify functionality from all three perspectives

## Getting Help

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify all steps in the DEMO_GUIDE.md
3. Try a different browser or incognito mode
4. Clear all browser data and start fresh

## Known Limitations

This is a demo application with the following limitations:
- No email notifications (email server not configured)
- No real-time updates (requires page refresh)
- Limited to browser localStorage for session management
- Not HIPAA-compliant (not for real medical data)
- No payment processing
- No insurance verification
- No medical records integration

For production use, these features would need to be implemented with proper security, compliance, and infrastructure.
