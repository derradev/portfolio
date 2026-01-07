-- Seed Data for William Malone Portfolio
-- Run this after database_setup.sql

-- ============================================
-- WILLIAM'S EDUCATION
-- ============================================

INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements) VALUES
(
  'Middlesbrough College',
  'BTEC in IT System Support and Networking',
  'IT Support',
  'Middlesbrough, England',
  '2010-09-01',
  '2012-07-01',
  'DDM (Distinction, Distinction, Merit)',
  'Comprehensive study of system support and networking with deep theoretical foundation. Coursework included diagnosing and repairing IT hardware and software, web development, and network and system architecture.',
  ARRAY['Strong performance with DDM grade', 'Built foundation for practical IT career']
),
(
  'Baltic Apprenticeships via Bishop Hogarth Catholic Education Trust',
  'IT Technician Apprenticeship',
  'IT Support',
  'St Michaels Catholic School, Billingham',
  '2023-12-18',
  NULL,
  NULL,
  'Hands-on apprenticeship combining practical IT support experience with formal training, working in a live school IT environment managing systems, users, and infrastructure.',
  ARRAY['Practical IT support experience', 'Live school IT environment management']
) ON CONFLICT DO NOTHING;

-- ============================================
-- WILLIAM'S WORK HISTORY
-- ============================================

INSERT INTO work_history (company, position, location, start_date, end_date, description, achievements, technologies, company_url) VALUES
(
  'Current Employer',
  'IT Support Engineer',
  'Middlesbrough, England',
  '2023-12-18',
  NULL,
  'IT Technician with hands-on experience managing Active Directory, user and group management, helpdesk ticket resolution, hardware setup and maintenance, and software deployment via PDQ.',
  ARRAY['Efficient helpdesk ticket resolution', 'Active Directory and Group Policy management', 'Hardware and software deployment across organization', 'User support and training'],
  ARRAY['Active Directory', 'PDQ Deploy', 'Windows Server', 'Group Policy', 'Helpdesk ticketing systems', 'Hardware diagnostics tools'],
  NULL
) ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE PROJECTS (Placeholder for William to update)
-- ============================================

INSERT INTO projects (title, description, technologies, github_url, live_url, date, featured, status, start_date, end_date) VALUES
(
  'Security Analysis Tool',
  'A comprehensive security analysis tool for vulnerability assessment and penetration testing. Built with Python to automate common security checks and generate detailed reports.',
  ARRAY['Python', 'Security', 'Automation', 'Penetration Testing'],
  'https://github.com/williammalone/security-analysis-tool',
  NULL,
  '2024-01-15',
  true,
  'in_progress',
  '2024-01-01',
  NULL
),
(
  'Python Automation Scripts',
  'Collection of Python scripts for IT automation, including user management, backup automation, and system monitoring. Designed to streamline daily IT operations.',
  ARRAY['Python', 'Automation', 'IT Operations', 'Scripting'],
  'https://github.com/williammalone/python-automation',
  NULL,
  '2024-02-01',
  false,
  'in_progress',
  '2024-01-15',
  NULL
),
(
  'Home Lab Network Setup',
  'Documentation and scripts for setting up a home penetration testing lab. Includes network configuration, virtual machine setup, and security tools installation.',
  ARRAY['Networking', 'Virtualization', 'Security', 'Kali Linux', 'Metasploit'],
  'https://github.com/williammalone/home-lab-setup',
  NULL,
  '2024-03-01',
  false,
  'planning',
  '2024-02-15',
  '2024-04-01'
) ON CONFLICT DO NOTHING;

-- ============================================
-- CERTIFICATIONS (Placeholder for future ones)
-- ============================================

-- This will be updated as William earns certifications
-- For now, adding placeholder for Security+ in progress

-- ============================================
-- BLOG POSTS (Sample posts for William to customize)
-- ============================================

INSERT INTO blog_posts (title, slug, excerpt, content, author, publish_date, read_time, category, tags, featured, published) VALUES
(
  'My Journey from IT Support to Cybersecurity',
  'my-journey-it-support-to-cybersecurity',
  'Sharing my transition story from IT support to pursuing a career in cybersecurity, including challenges, learnings, and goals.',
  '# My Journey from IT Support to Cybersecurity

## Background

I''ve been working as an IT Technician for several years, managing everything from Active Directory to hardware support. But I''ve always been drawn to security - understanding how systems can be compromised and, more importantly, how to protect them.

## Why Cybersecurity?

What excites me about cybersecurity is the puzzle-solving aspect. Every security incident is a mystery that needs solving, and prevention is about thinking like an attacker while building defenses.

## My Learning Path

I''m currently focusing on:
- CompTIA Security+ certification
- Python for security automation
- Building a home lab for hands-on practice
- Network security fundamentals

## Challenges

The biggest challenge has been bridging the gap between IT operations and security concepts. But my IT background gives me a unique advantage - I understand how systems actually work in practice.

## Goals

My goal is to transition into a penetration testing or security analyst role within the next year. I believe my IT foundation combined with dedicated security study will make me a well-rounded security professional.

## Next Steps

I''m documenting my journey through this blog, so follow along as I share what I learn!',
  'William Malone',
  '2024-01-10',
  8,
  'Career',
  ARRAY['Cybersecurity', 'Career Transition', 'IT Support', 'Learning'],
  true,
  true
),
(
  'Setting Up My Home Security Lab',
  'setting-up-home-security-lab',
  'A detailed guide on how I built my home penetration testing lab on a budget, including hardware choices, software setup, and network configuration.',
  '# Setting Up My Home Security Lab

## Hardware Requirements

Building a home lab doesn''t require expensive equipment. Here''s what I''m using:

- Laptop with 16GB RAM (my main machine)
- External hard drive for VMs
- Basic network switch for isolated testing

## Software Stack

- VirtualBox for virtualization
- Kali Linux as primary security OS
- Metasploit Framework
- Wireshark for network analysis
- Burp Suite for web testing

## Network Isolation

Key lesson: Always isolate your lab! I''m using:
- Separate VLAN for lab network
- Host-only network adapters in VMs
- No bridge connections to production networks

## First Projects

Starting with basic scenarios:
- Capturing network traffic
- Simple password cracking demos
- Web application vulnerability scanning

## Learning Resources

- TryHackMe beginner paths
- HackTheBox starting machines
- YouTube tutorials (The Cyber Mentor, IppSec)

## Budget Tips

Total cost so far: ~$200
- Used existing hardware
- Free software tools
- Community resources

The key is starting simple and building up gradually!',
  'William Malone',
  '2024-01-15',
  12,
  'Learning',
  ARRAY['Home Lab', 'Kali Linux', 'Metasploit', 'Network Security', 'Virtualization'],
  false,
  true
),
(
  'Python Scripts for IT Automation',
  'python-scripts-it-automation',
  'Sharing some of my most useful Python scripts that have saved me hours of manual IT work.',
  '# Python Scripts for IT Automation

## User Account Management Script

One of my most time-saving scripts automates user account creation:

```python
import active_directory
import csv

def create_users_from_csv(file_path):
    with open(file_path, ''r'') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Create user in AD
            create_ad_user(
                username=row[''username''],
                first_name=row[''first_name''],
                last_name=row[''last_name''],
                department=row[''department'']
            )
            print(f"Created user: {row[''username'']}")

# Usage
create_users_from_csv(''new_users.csv'')
```

## Backup Automation

Automated daily backups of critical systems:

```python
import shutil
import datetime
import os

def backup_critical_files():
    date = datetime.datetime.now().strftime(''%Y%m%d'')
    backup_path = f"/backups/system_backup_{date}"
    
    # Create backup directory
    os.makedirs(backup_path, exist_ok=True)
    
    # Copy critical files
    shutil.copytree("/etc", f"{backup_path}/etc")
    shutil.copytree("/home", f"{backup_path}/home")
    
    print(f"Backup completed: {backup_path}")

# Schedule with cron: 0 2 * * * /usr/bin/python3 backup.py
```

## Network Monitoring

Simple network monitoring script:

```python
import ping
import socket
import time

def monitor_hosts(hosts):
    while True:
        for host in hosts:
            try:
                response = ping.ping(host)
                if response.is_success:
                    print(f"{host}: UP")
                else:
                    print(f"{host}: DOWN - {response.error}")
            except Exception as e:
                print(f"{host}: ERROR - {e}")
        time.sleep(60)

# Monitor critical servers
servers = ["192.168.1.10", "192.168.1.20", "192.168.1.30"]
monitor_hosts(servers)
```

## Benefits

These scripts have saved me:
- 2-3 hours daily on user management
- Automated backup verification
- Proactive network monitoring
- Consistent documentation

## Next Steps

- Add error handling and logging
- Integrate with ticketing system
- Create web dashboard for monitoring
- Add email notifications for failures

Automation isn''t just about saving time - it''s about consistency and reliability in IT operations.',
  'William Malone',
  '2024-01-20',
  15,
  'Python',
  ARRAY['Python', 'Automation', 'IT Support', 'Scripting', 'Active Directory'],
  false,
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- ADDITIONAL LEARNING ITEMS
-- ============================================

INSERT INTO learning (title, description, progress, category, start_date, estimated_completion, resources, status) VALUES
(
  'Network Security Fundamentals',
  'Learning network security concepts including TCP/IP, firewalls, IDS/IPS, and network monitoring',
  30,
  'Cybersecurity',
  '2024-01-01',
  '2024-04-30',
  ARRAY['CompTIA Network+', 'Wireshark', 'Nmap', 'Snort'],
  'in_progress'
),
(
  'Penetration Testing Basics',
  'Introduction to penetration testing methodologies, tools, and reporting',
  15,
  'Cybersecurity',
  '2024-02-01',
  '2024-08-31',
  ARRAY['Metasploit', 'Burp Suite', 'OWASP Top 10', 'Penetration Testing Methodologies'],
  'in_progress'
),
(
  'Security+ Certification Study',
  'Comprehensive study for CompTIA Security+ certification exam',
  65,
  'Certification',
  '2024-01-15',
  '2024-05-30',
  ARRAY['Professor Messer Course', 'CompTIA CertMaster', 'Practice Exams', 'Study Notes'],
  'in_progress'
) ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

INSERT INTO setup_log (message) VALUES 
('Sample data inserted successfully for William Malone Portfolio');

SELECT 'Sample data insertion completed!' as status,
       NOW() as completed_at;
