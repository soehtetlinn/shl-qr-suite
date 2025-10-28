import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
  Badge,
  ListGroup,
  Modal,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { format } from 'date-fns';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  role: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchActivities();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      const profileData = response.data;
      setProfile(profileData);
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setPhone(profileData.phone || '');
      setCompany(profileData.company || '');
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get('/api/activity-logs');
      setActivities(response.data.slice(0, 10)); // Get last 10 activities
    } catch (error) {
      // Activities optional, don't show error
      setActivities([]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/api/profile', {
        firstName,
        lastName,
        phone,
        company,
      });
      setProfile(response.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await api.put('/api/profile/password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/api/profile');
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete account');
    }
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="gradient-text">My Profile</h2>
          <p className="text-muted">Manage your account settings and preferences</p>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          {/* Profile Summary Card */}
          <Card className="shadow-sm border-0 mb-4 fade-in">
            <Card.Body className="text-center p-4">
              <div
                className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '100px', height: '100px', fontSize: '48px' }}
              >
                👤
              </div>
              <h4 className="mb-1">
                {profile?.firstName && profile?.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.username || user?.username}
              </h4>
              <p className="text-muted mb-2">{profile?.email || user?.email}</p>
              <Badge bg="primary" className="mb-3">
                {profile?.role === 'admin' ? 'Administrator' : 'User'}
              </Badge>
              <div className="text-muted small">
                <p className="mb-0">
                  Member since {profile?.createdAt ? format(new Date(profile.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h6 className="mb-3">Account Statistics</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Profile Completeness</span>
                  <strong>
                    {Math.round(
                      (((firstName ? 1 : 0) + (lastName ? 1 : 0) + (phone ? 1 : 0) + (company ? 1 : 0)) / 4) * 100
                    )}
                    %
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Account Status</span>
                  <Badge bg="success">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Two-Factor Auth</span>
                  <Badge bg="secondary">Disabled</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body className="p-4">
              <Tabs defaultActiveKey="personal" className="mb-4">
                {/* Personal Information Tab */}
                <Tab eventKey="personal" title="Personal Information">
                  <Form onSubmit={handleUpdateProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" value={profile?.email || ''} disabled />
                      <Form.Text className="text-muted">
                        Contact support to change your email address
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" value={profile?.username || ''} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter company name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title="Security">
                  <h5 className="mb-3">Change Password</h5>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 8 characters long
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" disabled={saving}>
                        {saving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </Form>

                  <hr className="my-4" />

                  <h5 className="mb-3">Two-Factor Authentication</h5>
                  <Alert variant="info">
                    <strong>Coming Soon!</strong> Two-factor authentication will be available in the next
                    update to further secure your account.
                  </Alert>
                </Tab>

                {/* Activity Tab */}
                <Tab eventKey="activity" title="Activity">
                  <h5 className="mb-3">Recent Activity</h5>
                  {activities.length === 0 ? (
                    <Alert variant="info">No recent activity to display</Alert>
                  ) : (
                    <ListGroup variant="flush">
                      {activities.map((activity) => (
                        <ListGroup.Item key={activity.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{activity.action}</strong>
                              <p className="text-muted small mb-0">{activity.description}</p>
                              {activity.ipAddress && (
                                <p className="text-muted small mb-0">IP: {activity.ipAddress}</p>
                              )}
                            </div>
                            <small className="text-muted">
                              {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                            </small>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Tab>

                {/* Danger Zone Tab */}
                <Tab eventKey="danger" title="Danger Zone">
                  <Alert variant="danger">
                    <Alert.Heading>Danger Zone</Alert.Heading>
                    <p>
                      These actions are irreversible. Please be certain before proceeding.
                    </p>
                  </Alert>

                  <Card className="border-danger">
                    <Card.Body>
                      <h5 className="text-danger">Delete Account</h5>
                      <p className="text-muted">
                        Once you delete your account, there is no going back. All your QR codes and data
                        will be permanently deleted.
                      </p>
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete My Account
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          <p>
            Are you absolutely sure you want to delete your account? All your data, including QR codes
            and analytics, will be permanently deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Yes, Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;

