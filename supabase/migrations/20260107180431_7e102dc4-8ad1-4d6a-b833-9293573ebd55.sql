-- Assign client role to users without roles
INSERT INTO user_roles (user_id, role)
VALUES 
  ('04fc0949-ae81-4d7f-bc4e-d95be885364e', 'client'),
  ('9e46add8-d8cb-4222-a181-1346bea4868c', 'client'),
  ('4a5145ef-5821-495c-b8e9-245a8fe649cb', 'client')
ON CONFLICT DO NOTHING;