import { db } from '../server/db';
import { 
  users, content, ads, certificates, transactions, labs,
  type InsertUser, type InsertContent, type InsertAd, 
  type InsertCertificate, type InsertTransaction, type InsertLab
} from '../shared/schema';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data (optional - comment out for production)
    console.log('🧹 Clearing existing data...');
    await db.delete(certificates);
    await db.delete(transactions);
    await db.delete(ads);
    await db.delete(content);
    await db.delete(labs);
    await db.delete(users);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser: InsertUser = {
      firebaseUid: 'admin-firebase-uid',
      email: 'admin@cybersecure.academy',
      name: 'System Administrator',
      role: 'ADMIN',
      walletBalancePaise: 100000, // ₹1000
      bonusCredited: true,
      streakCount: 30,
      lastLoginAt: new Date(),
    };

    const [createdAdmin] = await db.insert(users).values(adminUser).returning();

    // Create sample cybersecurity content
    console.log('📚 Creating cybersecurity content...');
    const contentData: InsertContent[] = [
      // Trending Category
      {
        slug: 'advanced-threat-detection',
        title: 'Advanced Threat Detection & Response',
        description: 'Master the latest techniques in identifying and neutralizing cyber threats in real-time environments. Learn advanced SIEM configuration, threat hunting methodologies, and incident response procedures.',
        category: 'Trending',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        isPremium: true,
        isActive: true,
        duration: 16320, // 4h 32m
        instructorName: 'Dr. Sarah Chen',
        instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 125000,
      },
      {
        slug: 'network-security-fundamentals',
        title: 'Network Security Fundamentals',
        description: 'Build a strong foundation in network security principles and practical implementation strategies. Covers firewalls, VPNs, intrusion detection systems, and network monitoring.',
        category: 'Trending',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        isPremium: true,
        isActive: true,
        duration: 22500, // 6h 15m
        instructorName: 'Mike Rodriguez',
        instructorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 89000,
      },
      {
        slug: 'ethical-hacking-masterclass',
        title: 'Ethical Hacking Masterclass',
        description: 'Learn penetration testing and ethical hacking techniques used by security professionals worldwide. Hands-on training with real-world scenarios and industry-standard tools.',
        category: 'Trending',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        isPremium: true,
        isActive: true,
        duration: 31500, // 8h 45m
        instructorName: 'Alex Kumar',
        instructorImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 156000,
      },
      {
        slug: 'digital-forensics-investigation',
        title: 'Digital Forensics Investigation',
        description: 'Master digital evidence collection and analysis techniques for cybercrime investigation. Learn forensic tools, legal procedures, and evidence preservation methods.',
        category: 'Trending',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        isPremium: false,
        isActive: true,
        duration: 19200, // 5h 20m
        instructorName: 'Dr. Lisa Wang',
        instructorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 78000,
      },

      // Featured Category
      {
        slug: 'cloud-security-architecture',
        title: 'Cloud Security Architecture',
        description: 'Secure cloud infrastructures across AWS, Azure, and GCP with industry best practices. Learn cloud-native security tools, identity management, and compliance frameworks.',
        category: 'Featured',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        isPremium: true,
        isActive: true,
        duration: 27000, // 7h 30m
        instructorName: 'David Park',
        instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 92000,
      },
      {
        slug: 'incident-response-crisis-management',
        title: 'Incident Response & Crisis Management',
        description: 'Build effective incident response teams and manage cybersecurity crises professionally. Learn communication strategies, containment procedures, and recovery planning.',
        category: 'Featured',
        thumbnailUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        isPremium: true,
        isActive: true,
        duration: 15300, // 4h 15m
        instructorName: 'Rachel Green',
        instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 67000,
      },
      {
        slug: 'blockchain-cryptocurrency-security',
        title: 'Blockchain & Cryptocurrency Security',
        description: 'Secure blockchain networks and protect cryptocurrency infrastructure from attacks. Learn smart contract auditing, wallet security, and DeFi protocol analysis.',
        category: 'Featured',
        thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        isPremium: true,
        isActive: true,
        duration: 21600, // 6h 00m
        instructorName: 'Emma Thompson',
        instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 104000,
      },
      {
        slug: 'mobile-application-security',
        title: 'Mobile Application Security',
        description: 'Secure mobile applications and protect against mobile-specific attack vectors. Learn iOS and Android security models, app hardening, and mobile device management.',
        category: 'Featured',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        isPremium: false,
        isActive: true,
        duration: 13500, // 3h 45m
        instructorName: 'James Wilson',
        instructorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 58000,
      },

      // New Category
      {
        slug: 'zero-trust-architecture',
        title: 'Zero Trust Architecture Implementation',
        description: 'Implement Zero Trust security models in modern enterprise environments. Learn identity verification, micro-segmentation, and continuous monitoring strategies.',
        category: 'New',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        isPremium: true,
        isActive: true,
        duration: 18900, // 5h 15m
        instructorName: 'Dr. Michael Foster',
        instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 42000,
      },
      {
        slug: 'ai-ml-security',
        title: 'AI & Machine Learning Security',
        description: 'Secure AI/ML systems against adversarial attacks and data poisoning. Learn model protection, privacy-preserving ML, and AI governance frameworks.',
        category: 'New',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        isPremium: true,
        isActive: true,
        duration: 24300, // 6h 45m
        instructorName: 'Dr. Priya Sharma',
        instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 35000,
      },
      {
        slug: 'iot-security-fundamentals',
        title: 'IoT Security Fundamentals',
        description: 'Secure Internet of Things devices and networks. Learn device authentication, secure communication protocols, and IoT threat landscape analysis.',
        category: 'New',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518346001560-61da24084d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1518346001560-61da24084d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        isPremium: false,
        isActive: true,
        duration: 16200, // 4h 30m
        instructorName: 'Dr. Robert Kim',
        instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 29000,
      },
      {
        slug: 'social-engineering-defense',
        title: 'Social Engineering Defense',
        description: 'Learn to identify and defend against social engineering attacks and phishing campaigns. Develop security awareness training programs and human-centric security controls.',
        category: 'New',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
        bannerUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        isPremium: false,
        isActive: true,
        duration: 10800, // 3h 00m
        instructorName: 'Jessica Martinez',
        instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        viewCount: 48000,
      },
    ];

    const createdContent = await db.insert(content).values(contentData).returning();

    // Create sample ads
    console.log('📢 Creating advertisement content...');
    const adsData: InsertAd[] = [
      {
        placement: 'below_description',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        linkUrl: 'https://cybershield.example.com',
        title: 'CyberShield Pro Enterprise',
        description: 'Advanced threat protection for enterprise networks. Try free for 30 days.',
        active: true,
        weight: 3,
      },
      {
        placement: 'banner',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        linkUrl: 'https://cybercon2024.example.com',
        title: 'CyberCon 2024',
        description: 'Join the world\'s largest cybersecurity conference. Early bird pricing available.',
        active: true,
        weight: 2,
      },
      {
        placement: 'below_description',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        linkUrl: 'https://pentesttools.example.com',
        title: 'PenTest Tools Suite',
        description: 'Professional penetration testing toolkit. Get 50% off annual subscription.',
        active: false,
        weight: 1,
      },
    ];

    await db.insert(ads).values(adsData);

    // Create sample transactions for admin user
    console.log('💰 Creating sample transactions...');
    const transactionsData: InsertTransaction[] = [
      {
        userId: createdAdmin.id,
        amountPaise: 50000, // ₹500
        type: 'BONUS',
        note: 'Welcome bonus credited',
        status: 'COMPLETED',
      },
      {
        userId: createdAdmin.id,
        amountPaise: 10000, // ₹100
        type: 'REWARD',
        note: 'Daily streak bonus - 30 days',
        status: 'COMPLETED',
      },
    ];

    await db.insert(transactions).values(transactionsData);

    // Create sample certificate
    console.log('🏆 Creating sample certificate...');
    const certificateData: InsertCertificate = {
      userId: createdAdmin.id,
      contentId: createdContent[1].id, // Network Security Fundamentals
      certNo: 'CSA-2023-001',
      pdfUrl: '/certificates/CSA-2023-001.pdf',
    };

    await db.insert(certificates).values(certificateData);

    // Create sample labs (Phase 5)
    console.log('🔬 Creating cybersecurity labs...');
    const labsData: InsertLab[] = [
      {
        title: 'Network Penetration Testing',
        difficulty: 'ADVANCED',
        instructionsMd: `# Network Penetration Testing Lab

## Objective
Practice reconnaissance, exploitation, and post-exploitation techniques in a controlled environment.

## Prerequisites
- Basic networking knowledge
- Familiarity with Linux command line
- Understanding of TCP/IP protocols

## Lab Environment
- Target: Vulnerable network with multiple hosts
- Tools: Kali Linux, Metasploit, Nmap, Wireshark

## Instructions
1. Perform network reconnaissance using Nmap
2. Identify vulnerabilities using automated scanners
3. Exploit identified vulnerabilities
4. Establish persistence
5. Document findings and remediation steps

## Expected Duration
2-3 hours

## Learning Outcomes
- Network enumeration techniques
- Vulnerability exploitation
- Post-exploitation tactics
- Report writing skills`,
        repoUrl: 'https://github.com/cybersecure-academy/network-pentest-lab',
        active: true,
      },
      {
        title: 'Web Application Security',
        difficulty: 'INTERMEDIATE',
        instructionsMd: `# Web Application Security Lab

## Objective
Identify and exploit common web vulnerabilities including XSS, SQL injection, and CSRF.

## Prerequisites
- Basic web development knowledge
- Understanding of HTTP protocol
- Familiarity with browser developer tools

## Lab Environment
- Target: Deliberately vulnerable web application
- Tools: Burp Suite, OWASP ZAP, SQLmap

## Instructions
1. Map application functionality
2. Test for injection vulnerabilities
3. Identify authentication flaws
4. Test session management
5. Document vulnerabilities and fixes

## Expected Duration
1-2 hours

## Learning Outcomes
- Web vulnerability assessment
- Manual testing techniques
- Automated scanning tools
- Secure coding practices`,
        repoUrl: 'https://github.com/cybersecure-academy/webapp-security-lab',
        active: true,
      },
      {
        title: 'Malware Analysis',
        difficulty: 'EXPERT',
        instructionsMd: `# Malware Analysis Lab

## Objective
Reverse engineer malware samples using static and dynamic analysis techniques.

## Prerequisites
- Programming knowledge (C, Assembly)
- Understanding of Windows internals
- Virtual machine setup experience

## Lab Environment
- Isolated analysis environment
- Tools: IDA Pro, x64dbg, Process Monitor, Wireshark

## Instructions
1. Set up isolated analysis environment
2. Perform static analysis
3. Execute dynamic analysis
4. Identify malware capabilities
5. Create detection signatures

## Expected Duration
3-4 hours

## Learning Outcomes
- Malware analysis techniques
- Reverse engineering skills
- Threat intelligence creation
- Detection development`,
        repoUrl: 'https://github.com/cybersecure-academy/malware-analysis-lab',
        active: true,
      },
      {
        title: 'Digital Forensics Investigation',
        difficulty: 'INTERMEDIATE',
        instructionsMd: `# Digital Forensics Investigation Lab

## Objective
Investigate a simulated cyber crime scene and collect digital evidence.

## Prerequisites
- Basic understanding of file systems
- Knowledge of legal procedures
- Familiarity with evidence handling

## Lab Environment
- Forensic workstation with imaging tools
- Sample evidence (disk images, memory dumps)
- Tools: Autopsy, Volatility, FTK Imager

## Instructions
1. Create forensic images
2. Analyze file system artifacts
3. Extract deleted files
4. Analyze network traffic
5. Prepare forensic report

## Expected Duration
2-3 hours

## Learning Outcomes
- Digital forensics methodology
- Evidence preservation
- Artifact analysis
- Report writing`,
        repoUrl: 'https://github.com/cybersecure-academy/digital-forensics-lab',
        active: true,
      },
      {
        title: 'Cloud Security Assessment',
        difficulty: 'ADVANCED',
        instructionsMd: `# Cloud Security Assessment Lab

## Objective
Audit AWS/Azure cloud configurations and identify security misconfigurations.

## Prerequisites
- Cloud platform knowledge (AWS/Azure)
- Understanding of IAM concepts
- Basic scripting skills

## Lab Environment
- Cloud sandbox environment
- Misconfigured cloud resources
- Tools: Scout Suite, Prowler, CloudMapper

## Instructions
1. Enumerate cloud resources
2. Assess IAM configurations
3. Review storage permissions
4. Analyze network security groups
5. Generate remediation report

## Expected Duration
2-3 hours

## Learning Outcomes
- Cloud security best practices
- Configuration assessment
- Automated security scanning
- Risk prioritization`,
        repoUrl: 'https://github.com/cybersecure-academy/cloud-security-lab',
        active: true,
      },
      {
        title: 'Social Engineering Defense',
        difficulty: 'BEGINNER',
        instructionsMd: `# Social Engineering Defense Lab

## Objective
Learn to identify and defend against social engineering attacks and phishing campaigns.

## Prerequisites
- Basic understanding of human psychology
- Email and communication systems knowledge
- Security awareness concepts

## Lab Environment
- Email simulation platform
- Phishing campaign tools
- Training materials and resources

## Instructions
1. Analyze phishing email samples
2. Identify social engineering tactics
3. Create awareness training content
4. Test employee susceptibility
5. Develop defense strategies

## Expected Duration
1 hour

## Learning Outcomes
- Social engineering recognition
- Awareness training development
- Human factor security
- Incident response for social attacks`,
        repoUrl: 'https://github.com/cybersecure-academy/social-engineering-lab',
        active: true,
      },
    ];

    await db.insert(labs).values(labsData);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created:
    - 1 admin user
    - ${contentData.length} content items
    - ${adsData.length} advertisements
    - ${transactionsData.length} transactions
    - 1 certificate
    - ${labsData.length} lab exercises`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
