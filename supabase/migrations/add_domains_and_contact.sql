-- Custom domain mapping for published sites
CREATE TABLE IF NOT EXISTS project_custom_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id),
  UNIQUE(domain)
);

CREATE INDEX idx_custom_domains_domain ON project_custom_domains(domain);

-- Contact email on projects (where form submissions get forwarded)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Contact form submissions log
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  extra_fields JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_submissions_project ON contact_submissions(project_id);
