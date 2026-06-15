import { useState, useEffect, useRef, useCallback } from 'react'
import ChatBot from './components/ChatBot'
import Dashboard from './components/Dashboards'
import LegalPage from './components/LegalPage'
import {
  BriefcaseIcon, CodeIcon, CloudIcon, CogIcon,
  CheckIcon, ArrowRightIcon, StarIcon,
  GlobeIcon, ShieldIcon, ZapIcon, UsersIcon,
  BuildingIcon, AwardIcon, RocketIcon, HeartIcon,
  MapPinIcon, CoffeeIcon,
} from './components/Icons'
import { useProjects, useCaseStudies, useBlogs, useServices, useJobs } from './hooks/useContent'
import './App.css'
import localSvc1 from './assets/services/service1.png'
import localSvc2 from './assets/services/service2.png'
import localSvc3 from './assets/services/service3.png'
import localSvc4 from './assets/services/service4.png'
import localSvc5 from './assets/services/service5.png'
import localHero from './assets/hero/hero.jpg'
import localAbout1 from './assets/about/about1.jpg'
import localAbout2 from './assets/about/about2.jpg'
import localAbout3 from './assets/about/about3.jpg'
import localAbout4 from './assets/about/about4.jpg'
import localAbout5 from './assets/about/about5.jpg'
import localAbout6 from './assets/about/about6.jpg'
import localAbout7 from './assets/about/about7.jpg'
import localTeam1 from './assets/team/team1.jpg'
import localTeam2 from './assets/team/team2.jpg'
import localCulture1 from './assets/culture/culture1.jpg'
import localCulture2 from './assets/culture/culture2.jpg'
import localBuilding from './assets/building/building.jpg'
import localAvatar1 from './assets/avatars/avatar1.jpg'
import localAvatar2 from './assets/avatars/avatar2.jpg'
import localAvatar3 from './assets/avatars/avatar3.jpg'
import localAvatar4 from './assets/avatars/avatar4.jpg'
import localAvatar5 from './assets/avatars/avatar5.jpg'
import localAvatar6 from './assets/avatars/avatar6.jpg'
import localAuthor1 from './assets/avatars/author1.jpg'
import localAuthor2 from './assets/avatars/author2.jpg'
import localAuthor3 from './assets/avatars/author3.jpg'
import localAuthor4 from './assets/avatars/author4.jpg'
import localAuthor5 from './assets/avatars/author5.jpg'
import localAuthor6 from './assets/avatars/author6.jpg'
import localProject1 from './assets/projects/project1.jpg'
import localProject2 from './assets/projects/project2.jpg'
import localProject3 from './assets/projects/project3.jpg'
import localProject4 from './assets/projects/project4.jpg'
import localProject5 from './assets/projects/project5.jpg'
import localProject6 from './assets/projects/project6.jpg'
import localCs1 from './assets/casestudies/cs1.jpg'
import localCs2 from './assets/casestudies/cs2.jpg'
import localCs3 from './assets/casestudies/cs3.jpg'
import localCs4 from './assets/casestudies/cs4.jpg'
import localCs5 from './assets/casestudies/cs5.jpg'
import localCs6 from './assets/casestudies/cs6.jpg'
import localBlog1 from './assets/blogs/blog1.jpg'
import localBlog2 from './assets/blogs/blog2.jpg'
import localBlog3 from './assets/blogs/blog3.jpg'
import localBlog4 from './assets/blogs/blog4.jpg'
import localBlog5 from './assets/blogs/blog5.jpg'
import localBlog6 from './assets/blogs/blog6.jpg'
import localSvcWeb from './assets/services-full/svcWeb.jpg'
import localSvcCloud from './assets/services-full/svcCloud.jpg'
import localSvcAi from './assets/services-full/svcAi.jpg'
import localSvcApi from './assets/services-full/svcApi.jpg'
import localSvcSecurity from './assets/services-full/svcSecurity.jpg'
import localSvcMobile from './assets/services-full/svcMobile.jpg';

// =========================================================================
// Scroll Animation System
// =========================================================================
function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (options.once !== false) observer.unobserve(el)
        } else if (options.once === false) {
          setVisible(false)
        }
      },
      { threshold: options.threshold ?? 0.12, rootMargin: options.rootMargin ?? '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.once])

  return [ref, visible]
}

// Wraps any element and applies a reveal class when it enters viewport
function AnimateOnScroll({ children, className = '', type = 'fade-up', delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 })
  const classMap = {
    'fade-up':   'reveal',
    'fade-left': 'reveal-left',
    'fade-right':'reveal-right',
    'scale':     'reveal-scale',
  }
  const cls = [classMap[type] || 'reveal', visible ? 'visible' : '', className].filter(Boolean).join(' ')
  const delayStyle = delay ? { transitionDelay: `${delay}ms`, ...style } : style
  return (
    <div ref={ref} className={cls} style={delayStyle}>
      {children}
    </div>
  )
}

// Animated counter hook
function useCounter(target, duration = 2000, visible = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target, duration])
  return count
}

// 3D tilt component
function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(800px) rotateX(${-cy * 12}deg) rotateY(${cx * 12}deg) scale3d(1.02, 1.02, 1.02)`)
  }, [])

  const handleMouseLeave = useCallback(() => setTransform(''), [])

  return (
    <div ref={ref} className={className} style={{ transform, transition: transform ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out' }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}

// =========================================================================
// Image assets — Unsplash CDN. If a photo ever 404s, replace the ID.
// =========================================================================
const IMG = {
  hero: localHero,
  about1: localAbout1,
  about2: localAbout2,
  about3: localAbout3,
  about4: localAbout4,
  about5: localAbout5,
  about6: localAbout6,
  about7: localAbout7,
  project1: localProject1,
  project2: localProject2,
  project3: localProject3,
  project4: localProject4,
  project5: localProject5,
  project6: localProject6,
  team1: localTeam1,
  team2: localTeam2,
  culture1: localCulture1,
  culture2: localCulture2,
  building: localBuilding,
  avatar1: localAvatar1,
  avatar2: localAvatar2,
  avatar3: localAvatar3,
  avatar4: localAvatar4,
  avatar5: localAvatar5,
  avatar6: localAvatar6,
  author1: localAuthor1,
  author2: localAuthor2,
  author3: localAuthor3,
  author4: localAuthor4,
  author5: localAuthor5,
  author6: localAuthor6,
  localSvc1, localSvc2, localSvc3, localSvc4, localSvc5,
  localSvcWeb, localSvcCloud, localSvcAi, localSvcApi, localSvcSecurity, localSvcMobile,
  localCs1, localCs2, localCs3, localCs4, localCs5, localCs6,
  localBlog1, localBlog2, localBlog3, localBlog4, localBlog5, localBlog6,
}

// =========================================================================
// Data: Projects
// =========================================================================
const projectsData = [
  {
    id: 1,
    image: IMG.project1,
    tag: 'E-COMMERCE',
    title: 'Retail Platform Migration',
    client: 'Fashion Forward Inc.',
    year: '2025',
    desc: 'Migrated a legacy PHP monolith to React + Node.js microservices. 3x faster load times.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    fullDesc: 'Fashion Forward Inc. came to us with a struggling e-commerce platform built on outdated PHP. Their page load times were averaging 8+ seconds, cart abandonment was at 65%, and they were losing customers to faster competitors. We architected a complete rebuild using React for the frontend, Node.js microservices on the backend, and PostgreSQL for data persistence. The migration was performed incrementally using a strangler-fig pattern to minimize risk. The result was a 3x improvement in load times, 40% reduction in infrastructure costs, and a 25% increase in conversion rates within the first quarter post-launch.',
    results: ['3x faster page loads', '40% cost reduction', '25% conversion increase'],
  },
  {
    id: 2,
    image: IMG.project2,
    tag: 'AI CHATBOT',
    title: 'AI Customer Support Platform',
    client: 'Fintech Innovations',
    year: '2025',
    desc: 'Built an LLM-based chatbot handling 10,000+ daily queries, reducing support costs by 60%.',
    tech: ['Python', 'OpenAI', 'FastAPI', 'Redis'],
    fullDesc: 'Fintech Innovations was spending over $2M annually on customer support staff and still had response times averaging 15 minutes. We built an AI-powered chatbot using OpenAI\'s GPT-4 and a custom fine-tuning pipeline on their support documentation. The chatbot now handles over 10,000 conversations daily with a 92% resolution rate. We implemented human escalation for complex queries and built a real-time analytics dashboard to monitor performance and identify common pain points.',
    results: ['60% cost reduction', '10,000+ daily queries', '92% resolution rate'],
  },
  {
    id: 3,
    image: IMG.project3,
    tag: 'CLOUD MIGRATION',
    title: 'Scale-Ready Infrastructure',
    client: 'MediaStream Pro',
    year: '2024',
    desc: 'Moved 50-service architecture to AWS ECS with auto-scaling. Handles 10x traffic spikes.',
    tech: ['AWS ECS', 'Terraform', 'Kubernetes', 'CloudWatch'],
    fullDesc: 'MediaStream Pro was experiencing rapid growth but their infrastructure couldn\'t keep up. During peak events, their servers would crash, causing hours of downtime and lost revenue. We designed a cloud-native architecture using AWS ECS with auto-scaling policies that dynamically adjust capacity based on real-time demand. We implemented a blue-green deployment strategy, comprehensive monitoring with CloudWatch, and a disaster recovery plan with RTO under 15 minutes.',
    results: ['10x traffic capacity', '99.99% uptime', '< 15 min RTO'],
  },
  {
    id: 4,
    image: IMG.project4,
    tag: 'HEALTHTECH',
    title: 'HIPAA-Compliant Telemedicine Platform',
    client: 'HealthConnect',
    year: '2024',
    desc: 'Built a telemedicine platform serving 200+ clinics with end-to-end encryption.',
    tech: ['React Native', 'WebRTC', 'Node.js', 'AWS'],
    fullDesc: 'HealthConnect needed a telemedicine solution that could serve hundreds of clinics while maintaining strict HIPAA compliance. We built a cross-platform mobile app using React Native with WebRTC for video consultations, end-to-end encryption for all patient data, and a robust audit logging system. The platform includes appointment scheduling, prescription management, and integration with major EHR systems.',
    results: ['200+ clinics served', 'HIPAA compliant', '50,000+ consultations'],
  },
  {
    id: 5,
    image: IMG.project5,
    tag: 'DATA ANALYTICS',
    title: 'Real-Time Analytics Dashboard',
    client: 'RetailChain Global',
    year: '2024',
    desc: 'Built real-time analytics processing 50M+ events daily for business intelligence.',
    tech: ['Apache Kafka', 'ClickHouse', 'Grafana', 'Python'],
    fullDesc: 'RetailChain Global had data scattered across dozens of systems with no unified view of their business. We built a real-time analytics platform that ingests 50 million events daily from POS systems, e-commerce platforms, inventory management, and customer loyalty programs. Using Apache Kafka for stream processing and ClickHouse for the data warehouse, we delivered sub-second query performance on billions of rows of data.',
    results: ['50M+ daily events', '< 1s query latency', '$3M cost savings'],
  },
  {
    id: 6,
    image: IMG.project6,
    tag: 'FINTECH',
    title: 'Payment Processing Platform',
    client: 'PayFast Technologies',
    year: '2023',
    desc: 'High-throughput payment gateway processing $50M+ monthly with 99.999% uptime.',
    tech: ['Go', 'PostgreSQL', 'Redis', 'AWS'],
    fullDesc: 'PayFast needed to process millions of transactions monthly while maintaining near-perfect uptime and PCI-DSS compliance. We built a payment processing platform in Go optimized for high throughput and low latency. The system handles fraud detection in real-time, supports multiple payment methods and currencies, and integrates with 50+ banking partners globally.',
    results: ['$50M+ monthly volume', '99.999% uptime', 'PCI-DSS compliant'],
  },
]

// =========================================================================
// Data: Case Studies
// =========================================================================
const caseStudiesData = [
  {
    id: 1,
    image: IMG.localCs1,
    tag: 'DIGITAL TRANSFORMATION',
    title: 'How Fashion Forward Saved $2M and Tripled Performance',
    client: 'Fashion Forward Inc.',
    industry: 'E-commerce',
    duration: '8 months',
    challenge: 'Legacy PHP monolith causing 8+ second load times, 65% cart abandonment, and $500K annual maintenance costs.',
    solution: 'Complete platform rebuild using React + Node.js microservices with strangler-fig migration pattern.',
    outcome: '3x performance, 40% infrastructure cost reduction, 25% conversion increase.',
    sections: [
      { title: 'The Challenge', content: 'Fashion Forward\'s e-commerce platform was built in 2010 on a PHP monolith. As their catalog grew to 100,000+ products, performance degraded significantly. Page load times averaged 8.2 seconds, cart abandonment reached 65%, and annual infrastructure maintenance costs hit $500K. They were losing customers to faster competitors and their engineering team spent 70% of their time on maintenance rather than new features.' },
      { title: 'Our Approach', content: 'We started with a comprehensive audit of the existing system and identified the core customer journeys that represented 80% of their revenue. Using a strangler-fig pattern, we incrementally migrated functionality to new microservices while keeping the legacy system running. This allowed us to deploy early and often, getting real feedback throughout the process.' },
      { title: 'The Solution', content: 'The new architecture consisted of a React SPA for the frontend, a Node.js API gateway, and 12 independent microservices for catalog, inventory, orders, payments, customers, search, recommendations, analytics, notifications, shipping, reviews, and promotions. Each service owned its data and communicated via events.' },
      { title: 'Results', content: 'Page load times dropped from 8.2s to 2.7s. Infrastructure costs decreased by 40% due to right-sized compute and better caching. Cart abandonment dropped from 65% to 41%. The engineering team now ships features 4x faster and spends 80% of their time on new development rather than maintenance.' },
    ],
  },
  {
    id: 2,
    image: IMG.localCs2,
    tag: 'AI IMPLEMENTATION',
    title: 'Building an AI Support System Handling 10,000 Daily Conversations',
    client: 'Fintech Innovations',
    industry: 'Financial Services',
    duration: '6 months',
    challenge: '$2M annual support costs with 15-minute average response times and 40% customer satisfaction.',
    solution: 'LLM-powered chatbot with custom fine-tuning, human escalation, and real-time analytics.',
    outcome: '60% cost reduction, 92% query resolution rate, 4-second average response time.',
    sections: [
      { title: 'The Challenge', content: 'Fintech Innovations\' customer support team was overwhelmed. With 50,000+ users and growing, their support costs had reached $2M annually. Response times averaged 15 minutes during peak hours, and customer satisfaction scores had dropped to 40%. They needed a solution that could handle volume without sacrificing quality.' },
      { title: 'Our Approach', content: 'We spent the first month understanding their support patterns by analyzing 6 months of historical tickets. This revealed that 87% of queries fell into just 15 categories. We worked with their support team to create a comprehensive knowledge base and fine-tuned GPT-4 on their specific documentation and common issues.' },
      { title: 'The Solution', content: 'The AI chatbot integrates with their existing CRM and support systems. It handles tier-1 support queries autonomously while seamlessly escalating complex issues to human agents. A real-time analytics dashboard shows query volume, resolution rates, and emerging issues. The system learns from escalations to improve over time.' },
      { title: 'Results', content: 'Support costs dropped by 60% while handling 10,000+ daily conversations. Average response time fell from 15 minutes to 4 seconds. The chatbot resolves 92% of queries without human intervention. Customer satisfaction scores increased to 89%.' },
    ],
  },
  {
    id: 3,
    image: IMG.localCs3,
    tag: 'CLOUD INFRASTRUCTURE',
    title: 'From Downtime Disasters to 99.99% Uptime',
    client: 'MediaStream Pro',
    industry: 'Media & Entertainment',
    duration: '4 months',
    challenge: 'Frequent outages during peak events causing hours of downtime and $100K+ lost revenue per incident.',
    solution: 'Cloud-native architecture with auto-scaling, blue-green deployments, and comprehensive monitoring.',
    outcome: '99.99% uptime, handles 10x traffic spikes, 15-minute disaster recovery.',
    sections: [
      { title: 'The Challenge', content: 'MediaStream Pro streams live events to millions of viewers globally. Their existing infrastructure would collapse under peak loads, causing service outages during critical moments. Each outage cost them $100K+ in lost subscription revenue and advertising, plus long-term brand damage. They needed a solution that could handle sudden traffic spikes without downtime.' },
      { title: 'Our Approach', content: 'We conducted a thorough analysis of their traffic patterns and identified that 90% of their peak loads came from predictable events. We designed an architecture that could scale up proactively for known events and automatically for unexpected spikes. Security and disaster recovery were designed in from the start, not added later.' },
      { title: 'The Solution', content: 'We migrated to AWS ECS with auto-scaling policies based on multiple metrics including concurrent viewers, bitrate, and queue depth. Blue-green deployments allow zero-downtime updates. Multi-region active-active setup ensures resilience. Comprehensive monitoring with CloudWatch and custom dashboards gives real-time visibility.' },
      { title: 'Results', content: 'Since launch, they\'ve maintained 99.99% uptime including two major live events that saw 10x normal traffic. Disaster recovery time objective is now under 15 minutes. Infrastructure costs are actually 20% lower than their old setup despite the improved capabilities.' },
    ],
  },
  {
    id: 4,
    image: IMG.localCs4,
    tag: 'HEALTHTECH',
    title: 'Telemedicine Platform Serving 200+ Clinics Nationwide',
    client: 'HealthConnect',
    industry: 'Healthcare',
    duration: '7 months',
    challenge: 'Patient wait times averaging 3 weeks for specialist appointments, with no digital alternative available.',
    solution: 'HIPAA-compliant telemedicine platform with video consultations, e-prescriptions, and EHR integration.',
    outcome: '200+ clinics onboarded, 50,000+ consultations completed, 90% patient satisfaction.',
    sections: [
      { title: 'The Challenge', content: 'HealthConnect was a network of 200+ independent clinics struggling with appointment backlogs. Patients waited an average of 3 weeks to see specialists, and many rural patients had no access to specialty care at all. Their existing phone-based scheduling system was unable to handle the volume, and there was no digital patient experience.' },
      { title: 'Our Approach', content: 'We began with extensive user research across patients and providers to understand the real pain points. Security and HIPAA compliance were non-negotiable from day one. We designed a mobile-first experience that worked for both tech-savvy younger patients and older patients who needed simpler interfaces.' },
      { title: 'The Solution', content: 'The platform includes a patient mobile app for iOS and Android, a provider web dashboard, and a backend integration layer that connected to existing EHR systems. WebRTC powered the video consultations, with a fallback to audio-only for low-bandwidth connections. End-to-end encryption ensured HIPAA compliance.' },
      { title: 'Results', content: 'Average wait time for specialist appointments dropped from 3 weeks to 2 days. Over 50,000 consultations were completed in the first year. Patient satisfaction scores reached 90%, and the platform enabled healthcare access for thousands of rural patients who previously had no nearby specialists.' },
    ],
  },
  {
    id: 5,
    image: IMG.localCs5,
    tag: 'DATA ANALYTICS',
    title: 'Real-Time Analytics Platform Processing 50M Events Daily',
    client: 'RetailChain Global',
    industry: 'Retail & E-commerce',
    duration: '5 months',
    challenge: 'Business decisions made on data that was 48 hours old, leading to missed opportunities and excess inventory.',
    solution: 'Real-time data pipeline using Apache Kafka and ClickHouse, with sub-second query performance.',
    outcome: '50M+ daily events processed, <1s query latency, $3M annual cost savings in inventory management.',
    sections: [
      { title: 'The Challenge', content: 'RetailChain Global operated 500+ stores across 12 countries with a combined e-commerce platform. Their data warehouse refreshed only once every 48 hours, meaning the leadership team was making inventory and pricing decisions based on outdated information. This led to frequent stockouts on popular items and excess inventory on slow movers.' },
      { title: 'Our Approach', content: 'We designed a streaming data architecture that could handle the massive volume of POS transactions, e-commerce events, and inventory movements. Rather than replacing their existing systems, we built a real-time layer on top that fed into their existing BI tools, minimizing change management.' },
      { title: 'The Solution', content: 'Apache Kafka handled the stream ingestion from all 500+ stores and the e-commerce platform simultaneously. ClickHouse served as the analytical data warehouse, providing sub-second query performance on billions of rows. Custom Grafana dashboards gave store managers and executives real-time visibility into sales, inventory, and customer behavior.' },
      { title: 'Results', content: 'The platform now processes over 50 million events daily with query latency under 1 second. Inventory stockouts decreased by 35%, saving an estimated $3M annually. The executive team now makes data-driven decisions in real-time rather than waiting 48 hours for reports.' },
    ],
  },
  {
    id: 6,
    image: IMG.localCs6,
    tag: 'FINTECH',
    title: 'Payment Gateway Processing $50M+ Monthly with 99.999% Uptime',
    client: 'PayFast Technologies',
    industry: 'Financial Services',
    duration: '6 months',
    challenge: 'Legacy payment system unable to scale beyond 500 transactions per minute, causing dropped payments during peak sales.',
    solution: 'High-throughput payment platform built in Go with Redis caching and multi-region active-active deployment.',
    outcome: '$50M+ monthly volume, 99.999% uptime SLA, 3x faster transaction processing.',
    sections: [
      { title: 'The Challenge', content: 'PayFast Technologies was a growing payment processor handling transactions for 200+ e-commerce merchants. During major sales events like Black Friday, their system would crash under load, resulting in dropped transactions and lost revenue. Their legacy Java monolith could only handle 500 transactions per minute, far below what their growth trajectory required.' },
      { title: 'Our Approach', content: 'We conducted a thorough performance audit to identify the bottlenecks. The architecture review revealed that the biggest constraints were in the synchronous database calls and lack of horizontal scalability. We designed a new system that could scale horizontally while maintaining PCI-DSS compliance.' },
      { title: 'The Solution', content: 'We rebuilt the core payment processing engine in Go, optimized for high throughput and low latency. Redis handled caching and rate limiting, while PostgreSQL with read replicas managed transaction persistence. Multi-region active-active deployment across three AWS regions ensured zero downtime even during regional outages. Comprehensive fraud detection ran in real-time using a custom ML model.' },
      { title: 'Results', content: 'The new platform handles over 5,000 transactions per minute, 10x the previous capacity. Monthly transaction volume grew to $50M+. Uptime has been maintained at 99.999% since launch, including through two major sales events that would have crashed the old system. Transaction processing is 3x faster, with average latency under 200ms.' },
    ],
  },
]

// =========================================================================
// Data: Blogs
// =========================================================================
const blogsData = [
  {
    id: 1,
    image: IMG.localBlog1,
    authorImage: IMG.avatar1,
    tag: 'TECHNOLOGY',
    title: 'Why We Chose Go for Our High-Throughput Payment Platform',
    author: 'James Okafor',
    authorRole: 'Head of Engineering',
    date: 'June 10, 2026',
    readTime: '8 min read',
    excerpt: 'When processing $50M+ monthly, every microsecond matters. Here\'s why Go outperformed every other option for our payment gateway.',
    content: 'Performance was non-negotiable. Every millisecond of latency in a payment flow correlates with dropped transactions and lost customers. After benchmarking Go against Node.js, Rust, and Java, Go consistently delivered 40% better throughput with 60% lower memory usage. The language\'s built-in concurrency primitives (goroutines and channels) made it natural to handle thousands of simultaneous connections without the callback hell of Node.js or the complexity of Rust\'s async runtime. Deployment is trivial—just a single binary with no runtime dependencies. Our entire payment service deploys as a 15MB Docker image that starts in under 100ms.',
  },
  {
    id: 2,
    image: IMG.localBlog2,
    authorImage: IMG.avatar2,
    tag: 'AI & MACHINE LEARNING',
    title: 'Fine-Tuning LLMs on Domain-Specific Data: Lessons Learned',
    author: 'Priya Patel',
    authorRole: 'Head of AI/ML',
    date: 'June 5, 2026',
    readTime: '12 min read',
    excerpt: 'Generic LLMs are powerful, but domain-specific fine-tuning can 10x your accuracy. Here\'s what we learned from 50+ implementations.',
    content: 'The promise of fine-tuning is compelling: take a general-purpose LLM and adapt it to your specific domain for dramatically better results. In practice, it\'s more nuanced. We\'ve fine-tuned models for healthcare, legal, fintech, and e-commerce applications. The biggest lesson? More data isn\'t always better—it\'s about data quality and diversity. We found that 5,000 well-curated examples outperformed 50,000 hastily labeled ones. The fine-tuning process itself is deceptively simple in concept but requires careful attention to learning rates, context length, and evaluation metrics. One common mistake is fine-tuning on your test data, which leads to overfitting that only shows in production.',
  },
  {
    id: 3,
    image: IMG.localBlog3,
    authorImage: IMG.avatar3,
    tag: 'CLOUD & DEVOPS',
    title: 'The Hidden Costs of Cloud Migrations Nobody Talks About',
    author: 'Alex Chen',
    authorRole: 'CEO & Co-founder',
    date: 'May 28, 2026',
    readTime: '10 min read',
    excerpt: 'Cloud migrations promise cost savings, but the reality is more complex. Here are the hidden costs that catch most teams off guard.',
    content: 'Every cloud migration promises cost savings, but the reality is more nuanced. We\'ve helped dozens of companies migrate to AWS, Azure, and GCP. The hidden costs that consistently surprise teams include: 1) Data egress fees that can make "free" intra-cloud transfers surprisingly expensive when you factor in real-world traffic patterns. 2) The true cost of engineer time—migrations take 2-3x longer than expected, and you need dedicated resources. 3) The "lift and shift" trap: moving workloads without optimization often increases costs. 4) Security and compliance work that\'s often underestimated. 5) The operational overhead of managing multi-cloud or hybrid environments. The teams that succeed treat cloud migration as a transformation opportunity, not just a lift-and-shift exercise.',
  },
  {
    id: 4,
    image: IMG.localBlog4,
    authorImage: IMG.avatar4,
    tag: 'PRODUCT & DESIGN',
    title: 'How to Build Products Users Actually Love: Lessons from 150+ Projects',
    author: 'Tom Rodriguez',
    authorRole: 'Head of Design',
    date: 'May 20, 2026',
    readTime: '7 min read',
    excerpt: 'Great products aren\'t built by accident. Here are the design principles we\'ve refined across 150+ client engagements.',
    content: 'After working on 150+ products, patterns emerge. The best products share common traits: they solve one problem exceptionally well, they respect users\' time and attention, and they feel inevitable once you\'ve used them. The biggest mistake we see is feature bloat—teams confuse "more features" with "better product." The second biggest mistake is designing for the average user, which ends up delighting nobody. We practice "strong opinions, loosely held"—have a clear design vision but be willing to adapt based on real user feedback. The best metric isn\'t DAU or MAU—it\'s whether users come back without being prompted.',
  },
  {
    id: 5,
    image: IMG.localBlog5,
    authorImage: IMG.avatar5,
    tag: 'SECURITY',
    title: 'Securing Modern APIs: A Comprehensive Guide for 2026',
    author: 'Sarah Mitchell',
    authorRole: 'CTO & Co-founder',
    date: 'May 15, 2026',
    readTime: '15 min read',
    excerpt: 'API security incidents are rising. Here\'s the comprehensive security checklist we use for every project.',
    content: 'API security incidents have increased 400% over the past three years, and most are preventable with proper security practices. Our standard security checklist includes: Authentication (use OAuth 2.0 with PKCE, never roll your own auth), Authorization (implement fine-grained access control, default to deny), Input Validation (validate all inputs server-side, use parameterized queries), Rate Limiting (protect against abuse and DoS), Encryption (TLS 1.3 for all connections, encrypt sensitive data at rest), Logging (comprehensive audit logs for all sensitive operations), and Error Handling (never expose stack traces or internal details). Security isn\'t a feature—it\'s a foundation.',
  },
  {
    id: 6,
    image: IMG.localBlog6,
    authorImage: IMG.avatar6,
    tag: 'REMOTE WORK',
    title: 'Building High-Performance Remote Engineering Teams',
    author: 'Nina Kowalski',
    authorRole: 'Head of Client Success',
    date: 'May 8, 2026',
    readTime: '9 min read',
    excerpt: 'Remote work is here to stay. Here\'s how to build a remote culture that outperforms office-based teams.',
    content: 'We\'ve been remote-first since 2016, and the pandemic proved what we already knew: remote teams can outperform office-based teams when done right. The key isn\'t about recreating the office experience online—it\'s about leveraging the unique advantages of remote work. We focus on outcomes, not hours. Our engineers have flexibility in when they work, as long as they deliver. We over-communicate asynchronously, reserving synchronous meetings for things that truly benefit from real-time collaboration. We invest heavily in async documentation so knowledge isn\'t locked in people\'s heads. Trust is fundamental—if you can\'t trust your team to work without supervision, you have a hiring problem, not a remote work problem.',
  },
]

// =========================================================================
// Data: Careers
// =========================================================================
const careersData = [
  {
    id: 1,
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    salary: '$140K - $180K',
    description: 'We\'re looking for a Senior Full-Stack Engineer to lead development of client projects. You\'ll architect and build web applications using React, Node.js, and PostgreSQL, mentor junior developers, and collaborate closely with clients.',
    requirements: ['5+ years of full-stack development experience', 'Strong proficiency in React and Node.js', 'Experience with PostgreSQL and cloud platforms (AWS/GCP)', 'Excellent communication skills', 'Track record of delivering complex projects'],
    niceToHave: ['Experience with TypeScript', 'Background in fintech or healthtech', 'Open source contributions'],
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$150K - $200K',
    description: 'Join our AI practice to build LLM-powered solutions for clients across industries. You\'ll design and implement AI systems, fine-tune models, and create production-ready ML pipelines.',
    requirements: ['3+ years of machine learning experience', 'Strong Python skills with ML frameworks (PyTorch, TensorFlow)', 'Experience deploying LLM-based solutions', 'Understanding of MLOps practices', 'Ability to translate business requirements into technical solutions'],
    niceToHave: ['Published research or papers', 'Experience with RAG systems', 'Hugging Face ecosystem expertise'],
  },
  {
    id: 3,
    title: 'DevOps/Cloud Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$130K - $170K',
    description: 'We need a DevOps Engineer to design and maintain cloud infrastructure for our clients. You\'ll implement CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for critical systems.',
    requirements: ['4+ years of DevOps experience', 'Expert knowledge of AWS or GCP', 'Strong Kubernetes and Docker experience', 'Infrastructure as Code (Terraform, Pulumi)', 'Scripting skills (Python, Bash)'],
    niceToHave: ['AWS Solutions Architect certification', 'Experience with observability tools (Datadog, Grafana)', 'Security background'],
  },
  {
    id: 4,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    salary: '$120K - $160K',
    description: 'As a Product Designer, you\'ll own the design process from research to pixel-perfect handoff. You\'ll work on diverse client projects, creating interfaces that users love and that drive business results.',
    requirements: ['4+ years of product design experience', 'Strong portfolio showing end-to-end design process', 'Proficiency in Figma', 'Experience conducting user research', 'Ability to work in fast-paced environments'],
    niceToHave: ['Motion design skills', 'Frontend development knowledge', 'Experience with design systems'],
  },
  {
    id: 5,
    title: 'Technical Project Manager',
    department: 'Operations',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$110K - $150K',
    description: 'Lead projects from kickoff to delivery, coordinating between clients and engineering teams. You\'ll own timelines, communicate progress, and ensure successful outcomes.',
    requirements: ['3+ years of technical project management', 'Understanding of software development processes', 'Strong organizational and communication skills', 'Experience with project management tools', 'Ability to manage multiple concurrent projects'],
    niceToHave: ['PMP or similar certification', 'Technical background (developer, architect)', 'Agile/Scrum experience'],
  },
  {
    id: 6,
    title: 'Junior Frontend Developer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$80K - $110K',
    description: 'Kickstart your career building modern web applications. You\'ll work alongside senior engineers, learn best practices, and grow into an independent contributor.',
    requirements: ['1+ years of frontend development experience', 'Solid HTML, CSS, JavaScript skills', 'Familiarity with React', 'Eagerness to learn and grow', 'Strong problem-solving skills'],
    niceToHave: ['TypeScript experience', 'Computer science degree or bootcamp', 'Personal projects or open source contributions'],
  },
]

// =========================================================================
// Brand
// =========================================================================
function Logo({ light = false, onClick }) {
  return (
    <div className={'logo' + (light ? ' logo-light' : '')} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        {/* Bold geometric mark — IV monogram in a rounded square */}
        <rect x="1" y="1" width="32" height="32" rx="7" fill="#0f172a" />
        {/* Overlapping V and I — clean geometric letterform */}
        <path d="M9 9H16L22 20H15L9 9Z" fill="#8DC63F" />
        <path d="M22 9H25V25H22V9Z" fill="#ffffff" />
        {/* Subtle accent line bottom */}
        <rect x="9" y="26" width="16" height="2" rx="1" fill="#8DC63F" opacity="0.6" />
      </svg>
      <span>PIVOTALSTACKS</span>
    </div>
  )
}

// =========================================================================
// Header
// =========================================================================
function Header({ user, onGoDash, onSignOut, onViewAbout }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMobileOpen(false)
  const navLinks = [
    { href: '#hero', label: 'Home' },
    { label: 'About', action: onViewAbout },
    { href: '#projects', label: 'Projects' },
    { href: '#casestudies', label: 'Case Studies' },
    { href: '#blogs', label: 'Blogs' },
    { href: '#careers', label: 'Careers' },
    { href: '#services', label: 'Services' },
    { href: '#team', label: 'Team' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className={`header${scrolled ? ' scrolled' : ' header-image'}`}>
      <div className="header-inner">
        <Logo onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); close() }} />
        <nav className="nav">
          {navLinks.map((n) => (
            n.href ? <a key={n.href} href={n.href} onClick={close}>{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action(); close(); }} className="nav-btn">{n.label}</button>
          ))}
        </nav>
        <div className="header-cta">
          {user ? (
            <>
              <button className="header-link" onClick={onGoDash}>Dashboard</button>
              <button className="btn-login" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <button className="btn-login" onClick={() => { document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); close() }}>Get in Touch</button>
          )}
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
        </button>
      </div>
      {/* Mobile drawer */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {navLinks.map((n) => (
          n.href ? <a key={n.href} href={n.href} className="mobile-nav-link" onClick={close}>{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action(); close(); }} className="mobile-nav-link">{n.label}</button>
        ))}
        {!user && (
          <button className="btn-login w-full mt-4" onClick={() => { document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); close() }}>Get in Touch</button>
        )}
      </div>
    </header>
  )
}

// =========================================================================
// Hero
// =========================================================================
const techStack = ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL', 'Python', 'FastAPI', 'TensorFlow', 'Next.js', 'Tailwind CSS', 'MongoDB', 'NGINX']

function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const scrolled = window.scrollY
      const bg = el.querySelector('.hero-parallax-bg')
      if (bg) bg.style.transform = `translateY(${scrolled * 0.35}px)`
      const content = el.querySelector('.hero-content')
      if (content) content.style.transform = `translateY(${scrolled * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className="hero hero-image-bg"
      style={{ backgroundImage: `url(${IMG.hero})` }}
      ref={heroRef}
    >
      {/* Gradient mesh / blob overlay */}
      <div className="hero-image-overlay" aria-hidden />

      {/* Subtle background grid */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(141,198,63,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Dot grid pattern overlay */}
      <div aria-hidden className="dot-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-text hero-content">
          {/* Animated badge */}
          <div className="badge glow-pulse" style={{ animation: 'fadeInUp 0.6s ease both, glowPulse 2.5s ease-in-out 0.8s infinite' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 0 rgba(34,197,94,0.6)', animation: 'auth-badge-pulse 1.6s ease-out infinite' }} />
            Now hiring — Remote positions open
          </div>

          <h1 className="hero-title anim-fade-up" style={{ animationDelay: '0.1s' }}>
            We Build Software<br />
            <span className="hero-title-accent">That Scales.</span>
          </h1>
          <p className="hero-lead anim-fade-up" style={{ animationDelay: '0.2s' }}>
            Pivotal Stack delivers custom software development, cloud architecture, and AI integration solutions — helping businesses automate, scale, and innovate with modern technology.
          </p>

          <div className="hero-cta anim-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#contact" className="btn-shop btn-shine">
              Start a Project <ArrowRightIcon size={16} />
            </a>
            <a href="#services" className="btn-ghost btn-lg" style={{ color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '14px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Explore Services
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="anim-fade-up" style={{ animationDelay: '0.6s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll to explore</span>
            <div className="scroll-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
          </div>
        </div>

        {/* Right column — floating cards */}
        <div className="hero-image hero-content">
          <div className="hero-product-card">
            <div className="hero-product-card-thumb">
              <CodeIcon size={18} />
            </div>
            <div className="hero-product-card-info">
              <strong>Custom Development</strong>
              <span>Web · Mobile · APIs</span>
            </div>
            <span className="hero-product-card-price">100%</span>
          </div>

          <div className="hero-review-strip">
            <div className="hero-review-strip-stars">★★★★★</div>
            <div className="hero-review-strip-row">
              <div className="hero-review-strip-avatars">
                <img src={IMG.avatar1} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar2} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar3} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar4} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <span style={{ background: '#1f2937' }}>+50</span>
              </div>
              <strong>50+ Projects Delivered</strong>
            </div>
            <span className="hero-review-strip-meta">Trusted by startups and enterprises across 15+ countries.</span>
          </div>
        </div>
      </div>

      {/* Tech stack marquee at bottom of hero */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', flexShrink: 0 }}>Tech Stack</span>
          <div className="marquee-wrap" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="marquee-track">
              {[...techStack, ...techStack].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(141,198,63,0.6)', display: 'inline-block', flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Services
// =========================================================================
const services = [
  {
    Icon: CodeIcon,
    title: 'Web Development',
    features: ['Custom Web Applications', 'React & Next.js Expert', 'Performance Optimization', 'SEO-Friendly Architecture'],
    image: IMG.localSvc1,
    color: 'blue',
    tagline: 'Build modern, high-performance web applications that scale with your business.',
    description: 'We design and build custom web applications using cutting-edge technologies like React, Next.js, and Node.js. Our approach prioritizes performance, accessibility, and maintainability — so your application not only looks great but delivers exceptional user experiences that convert.',
    process: [
      { step: '01', title: 'Discovery & Planning', desc: 'We analyze your business goals, user needs, and technical requirements to define a clear roadmap.' },
      { step: '02', title: 'Design & Prototyping', desc: 'Our designers create wireframes and interactive prototypes for your approval before development begins.' },
      { step: '03', title: 'Agile Development', desc: 'We build in two-week sprints, delivering working software early and iterating based on your feedback.' },
      { step: '04', title: 'Launch & Growth', desc: 'We handle deployment, performance optimization, SEO hardening, and ongoing maintenance.' },
    ],
    benefits: ['3x faster load times', '99.99% uptime', 'SEO-optimized from day one', 'WCAG accessibility compliant'],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS', 'Vercel'],
    projects: 45,
    clients: 38,
  },
  {
    Icon: CloudIcon,
    title: 'Cloud Solutions',
    features: ['AWS / Azure / GCP', 'DevOps & CI/CD Pipelines', 'Auto-Scaling Infrastructure', '24/7 Monitoring'],
    image: IMG.localSvc2,
    color: 'purple',
    tagline: 'Migrate, optimize, and scale your infrastructure on enterprise-grade cloud platforms.',
    description: 'From initial migration to fully managed cloud operations, we help you leverage AWS, Azure, and GCP to build infrastructure that scales automatically, deploys confidently, and costs efficiently. We implement DevOps best practices including CI/CD pipelines, infrastructure as code, and proactive monitoring.',
    process: [
      { step: '01', title: 'Cloud Assessment', desc: 'We audit your current infrastructure, identify bottlenecks, and create a migration strategy.' },
      { step: '02', title: 'Architecture Design', desc: 'We design a cloud-native architecture tailored to your workload requirements and budget.' },
      { step: '03', title: 'Migration & Automation', desc: 'We migrate workloads using blue-green deployments and implement infrastructure as code.' },
      { step: '04', title: 'Optimization & Monitoring', desc: 'We set up auto-scaling, cost monitoring, and 24/7 alerting to keep your infrastructure healthy.' },
    ],
    benefits: ['40-60% cost reduction', '99.99% uptime SLA', 'Auto-scaling for peak traffic', 'Real-time monitoring & alerts'],
    technologies: ['AWS ECS/Fargate', 'Terraform', 'Kubernetes', 'CloudWatch', 'Docker', 'GitHub Actions', 'Azure DevOps'],
    projects: 32,
    clients: 27,
  },
  {
    Icon: CogIcon,
    title: 'AI & Automation',
    features: ['LLM Integration', 'Smart Chatbots', 'Workflow Automation', 'Data Processing Pipelines'],
    image: IMG.localSvc3,
    color: 'cyan',
    tagline: 'Integrate AI capabilities to automate workflows and unlock new revenue streams.',
    description: 'We build AI-powered solutions that go beyond the hype — solving real business problems with LLM integration, intelligent automation, and data pipelines. From customer support chatbots to document processing and predictive analytics, we help you harness AI to reduce costs and create competitive advantages.',
    process: [
      { step: '01', title: 'AI Opportunity Audit', desc: 'We identify high-impact automation opportunities in your current workflows and processes.' },
      { step: '02', title: 'Proof of Concept', desc: 'We build a rapid prototype to validate the AI approach before full commitment.' },
      { step: '03', title: 'Integration & Training', desc: 'We integrate with your systems, fine-tune models on your data, and train your team.' },
      { step: '04', title: 'Monitoring & Improvement', desc: 'We monitor performance, track ROI, and continuously improve accuracy over time.' },
    ],
    benefits: ['60% reduction in support costs', '92% query resolution rate', '24/7 instant response', 'Continuous learning & improvement'],
    technologies: ['OpenAI GPT-4', 'Python', 'FastAPI', 'LangChain', 'Redis', 'Pinecone', 'Apache Kafka'],
    projects: 28,
    clients: 24,
  },
  {
    Icon: BriefcaseIcon,
    title: 'API Integration',
    features: ['Payment Gateways', 'Third-Party APIs', 'Custom REST/GraphQL', 'System Integration'],
    image: IMG.localSvc4,
    color: 'green',
    tagline: 'Connect your systems and unlock data silos with custom API development.',
    description: 'We build robust APIs and integrate third-party services so your systems work together seamlessly. Whether it is payment processing, CRM integration, or building a custom GraphQL gateway, we create reliable, documented, and secure APIs that become a foundation for your product ecosystem.',
    process: [
      { step: '01', title: 'Integration Audit', desc: 'We map your data flows, identify integration points, and prioritize by business impact.' },
      { step: '02', title: 'API Design', desc: 'We design clean, intuitive APIs using OpenAPI specs and provide detailed documentation.' },
      { step: '03', title: 'Development & Testing', desc: 'We build robust APIs with comprehensive testing, error handling, and rate limiting.' },
      { step: '04', title: 'Deployment & Handoff', desc: 'We deploy to production, provide integration guides, and offer ongoing support.' },
    ],
    benefits: ['Sub-second response times', '99.99% API uptime', 'Comprehensive error handling', 'Detailed documentation'],
    technologies: ['REST', 'GraphQL', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Stripe', 'Twilio'],
    projects: 41,
    clients: 35,
  },
  {
    Icon: ShieldIcon,
    title: 'Cyber Security',
    features: ['Vulnerability Assessment', 'Penetration Testing', 'Compliance Solutions', 'Security Audits'],
    image: IMG.localSvc5,
    color: 'red',
    tagline: 'Protect your systems and data with enterprise-grade security practices.',
    description: 'Security is not an afterthought — it is a foundation. We provide comprehensive security services including vulnerability assessments, penetration testing, compliance solutions (SOC 2, HIPAA, PCI-DSS), and security audits. We help you identify weaknesses before attackers do and implement controls that actually protect your business.',
    process: [
      { step: '01', title: 'Security Assessment', desc: 'We conduct a thorough review of your current security posture, identifying gaps and risks.' },
      { step: '02', title: 'Penetration Testing', desc: 'We simulate real-world attacks to uncover vulnerabilities that automated tools miss.' },
      { step: '03', title: 'Remediation Planning', desc: 'We prioritize findings by risk level and create a clear remediation roadmap.' },
      { step: '04', title: 'Compliance & Audits', desc: 'We help you achieve and maintain compliance with detailed audit trails and documentation.' },
    ],
    benefits: ['Critical vulnerabilities fixed in 24h', 'SOC 2 / HIPAA / PCI-DSS ready', 'Detailed security reports', 'Ongoing monitoring'],
    technologies: ['Burp Suite', 'OWASP ZAP', 'Nmap', 'Metasploit', 'Splunk', 'Nessus', 'AWS Security Hub'],
    projects: 19,
    clients: 16,
  },
  {
    Icon: RocketIcon,
    title: 'Mobile Apps',
    features: ['iOS & Android', 'React Native & Flutter', 'Cross-Platform Solutions', 'App Store Deployment'],
    image: IMG.localSvcMobile,
    color: 'orange',
    tagline: 'Launch native-quality mobile experiences that work across iOS and Android.',
    description: 'We build cross-platform mobile applications using React Native and Flutter that deliver native-quality experiences without the cost of maintaining separate iOS and Android codebases. From concept to App Store deployment, we handle the full mobile development lifecycle including design, development, testing, and ongoing maintenance.',
    process: [
      { step: '01', title: 'Mobile Strategy', desc: 'We define your app\'s core functionality, target platforms, and user journey.' },
      { step: '02', title: 'UI/UX Design', desc: 'Our designers create mobile-first interfaces optimized for touch and small screens.' },
      { step: '03', title: 'Development & Testing', desc: 'We build using React Native or Flutter with comprehensive testing on real devices.' },
      { step: '04', title: 'App Store Launch', desc: 'We handle App Store and Google Play submission, including ASO and store listing optimization.' },
    ],
    benefits: ['Single codebase for iOS & Android', 'Native performance', 'App Store approval guaranteed', 'Ongoing maintenance & updates'],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store Connect', 'Google Play Console'],
    projects: 23,
    clients: 20,
  },
]

function Services({ onViewService }) {
  const colorMap = {
    blue:   { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/20' },
    purple: { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'ring-purple-500/20' },
    cyan:   { gradient: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-500/10', text: 'text-cyan-500', ring: 'ring-cyan-500/20' },
    green:  { gradient: 'from-green-500 to-green-600', bg: 'bg-green-500/10', text: 'text-green-500', ring: 'ring-green-500/20' },
    red:    { gradient: 'from-red-500 to-red-600', bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20' },
    orange: { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-500/10', text: 'text-orange-500', ring: 'ring-orange-500/20' },
  }

  return (
    <section id="services" className="svc-section">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">SERVICES</span>
            <h2>What We Offer</h2>
            <p>End-to-end solutions tailored to your business — from initial concept through ongoing growth.</p>
          </AnimateOnScroll>
        </div>

        {/* Service cards with image + content layout */}
        <div className="svc-grid">
          {services.map((s, i) => {
            const c = colorMap[s.color]
            const isEven = i % 2 === 0
            return (
              <AnimateOnScroll key={s.title} type={isEven ? 'fade-right' : 'fade-left'} delay={100}>
                <TiltCard className={`svc-card ${isEven ? '' : 'svc-card-reverse'} card-depth`}>
                  {/* Left: Image */}
                  <div className="svc-card-image img-overlay-reveal">
                    <img src={s.image} alt={s.title} />
                  </div>

                  {/* Right: Content */}
                  <div className="svc-card-content">
                    <div className={`svc-icon-wrap ${c.bg} ${c.text}`}>
                      <s.Icon size={28} />
                    </div>
                    <h3 className="svc-title">{s.title}</h3>
                    <ul className="svc-features">
                      {s.features.map((f) => (
                        <li key={f}>
                          <CheckIcon size={16} className={c.text} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => onViewService?.(i)} className="svc-learn-more" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#a78bfa', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'all 0.3s ease', padding: 0 }}>
                      View Details <ArrowRightIcon size={14} />
                    </button>
                  </div>
                </TiltCard>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// About / Why Choose Us
// =========================================================================
const aboutValues = [
  { Icon: ZapIcon,   title: 'Speed',         desc: '2-week sprint cycles. You see progress every two weeks — not every six months.', iconColor: 'primary' },
  { Icon: ShieldIcon, title: 'Transparency', desc: 'Real-time dashboards, weekly reports, and direct access to your engineering team.', iconColor: 'accent' },
  { Icon: GlobeIcon,  title: 'Flexibility',  desc: 'Scale up or down at any time. No lock-in contracts or hidden staffing fees.', iconColor: 'cyan' },
  { Icon: HeartIcon,  title: 'Ownership',    desc: 'We treat your product like our own. Long-term partnerships, not one-off projects.', iconColor: 'primary' },
]

const aboutStats = [
  { value: 8,  suffix: '+', label: 'Years in Business' },
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 50,  suffix: '+', label: 'Team Members' },
  { value: 15,  suffix: '+', label: 'Countries' },
]

function AnimatedStat({ value, suffix, label }) {
  const [ref, visible] = useScrollReveal()
  const count = useCounter(value, 1800, visible)
  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-border p-6 text-center card-depth reveal ${visible ? 'visible' : ''}`}>
      <div className="text-4xl font-black text-primary mb-1">
        <span className="counter-num">{count}</span><span>{suffix}</span>
      </div>
      <div className="text-text-muted text-sm font-medium">{label}</div>
    </div>
  )
}

function AboutSection() {
  return (
    <section className="section section-alt">
      <div className="container">
        {/* Stats Row (no hero) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {aboutStats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>

        {/* 3. Story Section - Image + Text */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <AnimateOnScroll type="fade-right">
            <img src={IMG.about5} alt="Our story" className="rounded-2xl w-full h-80 object-cover mb-6" />
            <img src={IMG.about6} alt="Our workspace" className="rounded-2xl w-full h-48 object-cover" />
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">Our Story</span>
            <h3 className="text-3xl font-bold mb-6">From a 3-Person Garage to a Global Team</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              It started with a simple frustration: too many software projects failed not because of bad code, but because nobody understood the business. We founded Pivotal Stack to change that.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              Today, we're 50+ engineers, designers, and strategists across San Francisco, London, Bangalore, and Singapore — but our mission remains the same: understand your business first, build the right solution second.
            </p>
            <p className="text-text-muted leading-relaxed mb-6">
              Every engagement starts with understanding your business — not just the features you want, but the outcomes you need. Then we build the right thing, the right way, and stay to make sure it keeps working.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              Work with us <ArrowRightIcon size={14} />
            </a>
          </AnimateOnScroll>
        </div>



        {/* 5. Process Section - Visual timeline with image accent */}
        <div className="mb-20">
          <AnimateOnScroll type="fade-up">
            <div className="text-center mb-12">
              <span className="eyebrow">OUR PROCESS</span>
              <h3 className="text-3xl font-bold mt-2">How We Work</h3>
            </div>
          </AnimateOnScroll>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={IMG.about7} alt="Our process" className="w-full h-64 object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-6 md:px-12">
                {[
                  { n: '01', title: 'Discovery', desc: 'Deep-dive into your goals' },
                  { n: '02', title: 'Design', desc: 'Wireframes & prototypes' },
                  { n: '03', title: 'Build', desc: 'Agile sprints' },
                  { n: '04', title: 'Launch', desc: 'Zero-downtime deploy' },
                ].map((step, i) => (
                  <AnimateOnScroll key={step.n} type="fade-up" delay={i * 100}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="text-3xl font-black text-primary/20 mb-2">{step.n}</div>
                      <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                      <p className="text-text-muted text-xs">{step.desc}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Values Grid */}
        <div className="mb-20">
          <AnimateOnScroll type="fade-up">
            <div className="text-center mb-12">
              <span className="eyebrow">OUR VALUES</span>
              <h3 className="text-3xl font-bold mt-2">What Sets Us Apart</h3>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutValues.map(({ Icon, title, desc, iconColor }, i) => {
              const colorClass = iconColor === 'accent' ? 'bg-accent/10 text-accent' : iconColor === 'cyan' ? 'bg-cyan/10 text-cyan' : 'bg-primary/10 text-primary'
              return (
                <AnimateOnScroll key={title} type="scale" delay={i * 80}>
                  <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all card-depth text-center">
                    <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-base mb-2">{title}</h4>
                    <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <AnimateOnScroll type="fade-up">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] rounded-3xl p-12 md:p-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Build Something Great Together?</h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Let's start with a conversation about your goals.</p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#8DC63F] text-[#0f172a] font-bold px-8 py-4 rounded-full hover:bg-[#7BB333] transition-all hover:gap-4">
              Start the Conversation <ArrowRightIcon size={18} />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

// =========================================================================
// Experience & Milestones
// =========================================================================
const milestones = [
  { year: '2016', title: 'Founded in a garage', desc: 'Started with 3 engineers and a vision to build software that actually works.' },
  { year: '2018', title: 'First enterprise client', desc: 'Signed our first Fortune 500 company. Grew to 15 team members.' },
  { year: '2020', title: 'AI practice launched', desc: 'Added ML and LLM integration services. Doubled revenue despite global challenges.' },
  { year: '2022', title: 'Global expansion', desc: 'Opened offices in Europe and Asia. Now serving clients in 15+ countries.' },
  { year: '2024', title: '50-person milestone', desc: 'Crossed 50 engineers, designers, and strategists. Launched open-source toolchain.' },
  { year: '2026', title: 'The next chapter', desc: 'Scaling our AI and cloud practices to meet growing global demand.' },
]

function Milestones() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2>Eight Years of Building</h2>
            <p>From a small startup to a global software company — one milestone at a time.</p>
          </AnimateOnScroll>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <AnimateOnScroll key={m.year} type="fade-up" delay={i * 100}>
              <div className="relative pl-8 border-l-2 border-border hover:border-primary transition-colors">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                <div className="text-primary font-bold text-sm mb-1">{m.year}</div>
                <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
                <p className="text-text-muted text-sm">{m.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Our Team
// =========================================================================
const team = [
  { photo: IMG.avatar1, name: 'Alex Chen', role: 'CEO & Co-founder', detail: '15+ years in software architecture. Built systems at Google and Stripe.' },
  { photo: IMG.avatar2, name: 'Sarah Mitchell', role: 'CTO & Co-founder', detail: 'Former tech lead at Meta. PhD in Distributed Systems from MIT.' },
  { photo: IMG.avatar3, name: 'James Okafor', role: 'Head of Engineering', detail: 'Full-stack architect. Led teams at Amazon and Microsoft.' },
  { photo: IMG.avatar4, name: 'Priya Patel', role: 'Head of AI/ML', detail: 'ML researcher turned engineer. Published 12 papers on NLP and CV.' },
  { photo: IMG.avatar5, name: 'Tom Rodriguez', role: 'Head of Design', detail: 'Product design veteran. Ex-Apple and Figma design lead.' },
  { photo: IMG.avatar6, name: 'Nina Kowalski', role: 'Head of Client Success', detail: '7+ years managing enterprise accounts across Europe and North America.' },
]

function Team() {
  return (
    <section id="team" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">OUR PEOPLE</span>
            <h2>Meet the Team</h2>
            <p>Engineers, designers, and strategists united by a love for building great software.</p>
          </AnimateOnScroll>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((t, i) => (
            <AnimateOnScroll key={t.name} type="scale" delay={i * 80}>
              <div className="text-center group">
                <TiltCard className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-colors card-depth">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                </TiltCard>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <div className="text-primary text-sm font-medium mb-2">{t.role}</div>
                <p className="text-text-muted text-sm">{t.detail}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="btn-outline btn-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
            Join Our Team <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Culture & Work Environment
// =========================================================================
const culture = [
  { Icon: CoffeeIcon, title: 'Remote-First Culture', desc: 'Work from anywhere. We trust our team to deliver great results on their own terms.' },
  { Icon: HeartIcon, title: 'People Over Process', desc: 'We invest in our people with competitive salaries, health benefits, and learning budgets.' },
  { Icon: RocketIcon, title: 'Ship Fast, Learn Faster', desc: 'We release early, gather feedback, and iterate. Perfection is the enemy of progress.' },
  { Icon: AwardIcon, title: 'Excellence by Default', desc: 'We don\'t cut corners. Clean code, thorough testing, and detailed documentation are non-negotiable.' },
]

function Culture() {
  return (
    <section id="culture" className="section">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll type="fade-right">
            <span className="eyebrow">CULTURE</span>
            <h2>How We Work</h2>
            <p className="text-text-muted mb-8">We're not just building software — we're building a company where talented people do the best work of their careers.</p>
            <div className="space-y-6">
              {culture.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-text-muted text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-left" delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <img src={IMG.culture1} alt="Team collaboration" className="rounded-xl w-full h-48 object-cover img-overlay-reveal" />
              <img src={IMG.culture2} alt="Office environment" className="rounded-xl w-full h-48 object-cover mt-8 img-overlay-reveal" />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Global Presence
// =========================================================================
const offices = [
  { city: 'San Francisco', country: 'USA', role: 'Headquarters', flag: '🇺🇸' },
  { city: 'London', country: 'UK', role: 'European Hub', flag: '🇬🇧' },
  { city: 'Bangalore', country: 'India', role: 'Engineering Center', flag: '🇮🇳' },
  { city: 'Singapore', country: 'Singapore', role: 'APAC Hub', flag: '🇸🇬' },
]

function Global() {
  return (
    <section id="global" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">GLOBAL PRESENCE</span>
            <h2>Where We Work</h2>
            <p>A distributed team serving clients across multiple time zones and continents.</p>
          </AnimateOnScroll>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {offices.map((o, i) => (
            <AnimateOnScroll key={o.city} type="scale" delay={i * 80}>
              <div className="border border-border rounded-xl p-6 text-center hover:border-primary hover:shadow-lg transition-all card-depth">
                <div className="text-4xl mb-3">{o.flag}</div>
                <h3 className="font-semibold text-lg">{o.city}</h3>
                <div className="text-text-muted text-sm">{o.country}</div>
                <div className="text-primary text-xs font-medium mt-2">{o.role}</div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll type="fade-up" delay={200}>
          <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to work with us?</h3>
            <p className="text-white/80 mb-6">We'd love to hear about your project. Let's build something great together.</p>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
              Get in Touch <ArrowRightIcon size={16} />
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Projects Section
// =========================================================================
function HomeProjects({ onViewAll }) {
  const { projects, loading } = useProjects({ featured: true })
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">PROJECTS</span>
            <h2>Featured Work</h2>
            <p>A selection of projects we've built for our clients across industries.</p>
          </AnimateOnScroll>
        </div>
        <div className="showcase-grid">
          {(loading ? [] : projects.slice(0, 3)).map((p, i) => (
            <AnimateOnScroll key={p.id || i} type="fade-up" delay={i * 120}>
              <TiltCard className="showcase-card card-depth">
                <div className="showcase-image img-overlay-reveal">
                  <img src={p.image ? (p.image.startsWith('/') ? p.image : IMG[p.image] || p.image) : IMG.project1} alt={p.title} />
                </div>
                <div className="showcase-body">
                  <span className="showcase-tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.tech || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Projects <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Case Studies Section
// =========================================================================
function HomeCaseStudies({ onViewAll }) {
  const { caseStudies, loading } = useCaseStudies({ featured: true })
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const data = loading ? [] : caseStudies
  const total = data.length

  const prev = () => {
    setIdx(i => Math.max(0, i - 1))
    trackRef.current?.scrollTo({ left: Math.max(0, idx - 1) * 420, behavior: 'smooth' })
  }
  const next = () => {
    setIdx(i => Math.min(total - 1, i + 1))
    trackRef.current?.scrollTo({ left: Math.min(total - 1, idx + 1) * 420, behavior: 'smooth' })
  }

  return (
    <section id="casestudies" className="section">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">CASE STUDIES</span>
            <h2>In-Depth Success Stories</h2>
            <p>Deep dives into how we've helped clients solve complex challenges.</p>
          </AnimateOnScroll>
        </div>
        <div className="relative">
          <button onClick={prev} className="cs-prev carousel-btn" disabled={idx === 0} aria-label="Previous">
            <ArrowRightIcon size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="cs-track" ref={trackRef}>
            {data.map((cs, i) => (
              <article key={cs.id || i} className={`cs-card${i === idx ? ' active' : ''} card-depth`}>
                <div className="cs-card-image img-overlay-reveal">
                  <img src={cs.image ? (cs.image.startsWith('/') ? cs.image : IMG['localCs' + cs.image] || cs.image) : IMG.localCs1} alt={cs.title} />
                </div>
                <div className="cs-card-body">
                  <span className="cs-tag">{cs.tag}</span>
                  <h3 className="cs-title">{cs.title}</h3>
                  <div className="cs-meta">
                    <span><strong>Client:</strong> {cs.client}</span>
                    <span><strong>Industry:</strong> {cs.industry}</span>
                    <span><strong>Duration:</strong> {cs.duration}</span>
                  </div>
                  <p className="cs-outcome">{cs.outcome}</p>
                  <button onClick={onViewAll} className="cs-read-btn">
                    Read case study <ArrowRightIcon size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button onClick={next} className="cs-next carousel-btn" disabled={idx >= total - 1} aria-label="Next">
            <ArrowRightIcon size={18} />
          </button>
        </div>
        {/* Dots */}
        <div className="cs-dots">
          {data.map((_, i) => (
            <button key={i} className={`cs-dot${i === idx ? ' active' : ''}`} onClick={() => { setIdx(i); trackRef.current?.scrollTo({ left: i * 420, behavior: 'smooth' }) }} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="btn-outline btn-lg" onClick={onViewAll}>View All Case Studies <ArrowRightIcon size={16} /></button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Blogs Section
// =========================================================================
function HomeBlogs({ onViewAll }) {
  const { blogs, loading } = useBlogs()
  const data = loading ? [] : blogs
  return (
    <section id="blogs" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">BLOGS</span>
            <h2>Insights & Expertise</h2>
            <p>Thoughts on technology, design, and building great products.</p>
          </AnimateOnScroll>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.slice(0, 3).map((b, i) => (
            <AnimateOnScroll key={b.id || i} type="fade-up" delay={i * 100}>
              <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group card-depth">
                <div className="h-44 overflow-hidden img-overlay-reveal">
                  <img src={b.image ? (b.image.startsWith('/') ? b.image : IMG['localBlog' + b.image] || b.image) : IMG.localBlog1} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="text-primary font-medium">{b.tag}</span>
                    <span>·</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2 line-clamp-2">{b.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2 mb-4">{b.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={b.authorImage ? (b.authorImage.startsWith('/') ? b.authorImage : IMG['author' + b.authorImage] || b.authorImage) : IMG.author1} alt={b.authorName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs text-text-muted">{b.authorName}</span>
                    </div>
                    <span className="text-xs text-text-muted">{b.date}</span>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Blogs <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Careers Section
// =========================================================================
function HomeCareers({ onViewAll }) {
  return (
    <section id="careers" className="section">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">CAREERS</span>
            <h2>Join Our Team</h2>
            <p>Remote-first, people-focused. Build the future of software with us.</p>
          </AnimateOnScroll>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careersData.slice(0, 3).map((job, i) => (
            <AnimateOnScroll key={job.id} type="fade-up" delay={i * 100}>
              <div className="bg-white rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all job-card-shimmer card-depth">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base mb-1">{job.title}</h3>
                    <p className="text-text-muted text-sm">{job.department}</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">{job.type}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1"><MapPinIcon size={12} /> {job.location}</span>
                  <span className="flex items-center gap-1"><UsersIcon size={12} /> {job.salary}</span>
                </div>
                <button onClick={onViewAll} className="w-full text-center text-sm font-semibold text-primary hover:underline">
                  View Details <ArrowRightIcon size={12} />
                </button>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Openings <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Contact
// =========================================================================
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
      setForm({ name: '', email: '', subject: 'general', message: '' })
    } catch (err) {
      setError('Could not send — please try again later.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimateOnScroll type="fade-up">
            <span className="eyebrow">CONTACT</span>
            <h2>Let's Build Something Together</h2>
            <p>Have a project in mind? Drop us a line and we'll get back to you within one business day.</p>
          </AnimateOnScroll>
        </div>
        <div className="contact-grid">
          {/* Left — form */}
          <AnimateOnScroll type="fade-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent && (
                <div className="contact-success">
                  <CheckIcon size={16} /> Thanks! We got your message and will reply shortly.
                </div>
              )}
              {error && <div className="auth-error">{error}</div>}
              <div className="field-row">
                <label className="field-label">
                  Name
                  <input type="text" value={form.name} onChange={update('name')} placeholder="Jane Smith" required />
                </label>
                <label className="field-label">
                  Email
                  <input type="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" required />
                </label>
              </div>
              <label className="field-label">
                Subject
                <select value={form.subject} onChange={update('subject')}>
                  <option value="general">General inquiry</option>
                  <option value="project">New project</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="support">Existing project support</option>
                  <option value="careers">Careers</option>
                </select>
              </label>
              <label className="field-label">
                Message
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your project…"
                  required
                />
              </label>
              <button type="submit" className="btn-primary btn-lg btn-block" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'} <ArrowRightIcon size={16} />
              </button>
            </form>
          </AnimateOnScroll>

          {/* Right — info cards */}
          <aside className="contact-info">
            {[
              { icon: 'blue', title: 'Email us', value: 'hello@pivotalstack.com', meta: 'Replies within 1 business day' },
              { icon: 'green', title: 'Slack & Discord', value: 'Join our community', meta: 'Quick responses during business hours' },
              { icon: 'purple', title: 'Location', value: 'Remote-first company', meta: 'Working with clients worldwide' },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} type="fade-left" delay={i * 100}>
                <div className="contact-info-card">
                  <div className={`contact-info-icon contact-info-icon-${item.icon}`}>
                    {item.icon === 'blue' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                    )}
                    {item.icon === 'green' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    )}
                    {item.icon === 'purple' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    )}
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.value}</span>
                    <span className="contact-info-meta">{item.meta}</span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}

            <AnimateOnScroll type="fade-left" delay={300}>
              <div className="contact-socials">
                <a href="https://twitter.com/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://linkedin.com/company/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11 19h-3v-11h3zm-1.5-12.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zm13.5 12.3h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04a3.16 3.16 0 0 1 2.84-1.56c3.04 0 3.6 2 3.6 4.6z"/></svg></a>
                <a href="https://github.com/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg></a>
                <a href="https://youtube.com/@ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg></a>
              </div>
            </AnimateOnScroll>
          </aside>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Footer
// =========================================================================
function Footer({ onPrivacy, onTerms, onSecurity, onProjects, onCaseStudies, onBlogs, onCareers, onServices }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo light />
          <p>Building the software that powers modern businesses.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Services</h4>
            <a href="#services">Custom Development</a>
            <a href="#services">Cloud & DevOps</a>
            <a href="#services">AI Integration</a>
            <a href="#services">API Development</a>
          </div>
          <div>
            <h4>Company</h4>
            <button onClick={onProjects} className="text-left hover:text-primary transition-colors">Projects</button>
            <button onClick={onCaseStudies} className="text-left hover:text-primary transition-colors">Case Studies</button>
            <button onClick={onServices} className="text-left hover:text-primary transition-colors">Services</button>
            <button onClick={onBlogs} className="text-left hover:text-primary transition-colors">Blogs</button>
            <button onClick={onCareers} className="text-left hover:text-primary transition-colors">Careers</button>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#experience">Our Journey</a>
            <a href="#global">Global Presence</a>
            <a href="#culture">Culture</a>
            <a href="#contact">Get in Touch</a>
          </div>
          <div>
            <h4>Legal</h4>
            <button onClick={onPrivacy} className="text-left hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={onTerms} className="text-left hover:text-primary transition-colors">Terms of Service</button>
            <button onClick={onSecurity} className="text-left hover:text-primary transition-colors">Security</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 Pivotal Stack. All rights reserved.</span>
          <span>Built with precision. Delivered with care.</span>
        </div>
      </div>
    </footer>
  )
}

// =========================================================================
// =========================================================================
// Projects Page (full listing + detail)
// =========================================================================
function ProjectsPage({ onBack }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const p = projectsData.find(x => x.id === selected)
    return (
      <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"><ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all projects</button>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img src={p.image} alt={p.title} className="rounded-2xl w-full h-80 object-cover" />
            </div>
            <div>
              <span className="showcase-tag">{p.tag}</span>
              <h1 className="text-3xl font-bold mt-3 mb-2">{p.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
                <span><strong>Client:</strong> {p.client}</span>
                <span><strong>Year:</strong> {p.year}</span>
              </div>
              <p className="text-text-muted leading-relaxed mb-6">{p.fullDesc}</p>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map(t => <span key={t} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{t}</span>)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Results</h3>
                <div className="flex flex-wrap gap-3">
                  {p.results.map(r => (
                    <span key={r} className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">
                      <CheckIcon size={14} /> {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
        <div className="section-head mb-12">
          <span className="eyebrow">PROJECTS</span>
          <h2>All Projects</h2>
          <p>Explore our portfolio of work across industries and technologies.</p>
        </div>
        <div className="showcase-grid">
          {projectsData.map((p) => (
            <article key={p.id} className="showcase-card cursor-pointer" onClick={() => setSelected(p.id)}>
              <div className="showcase-image">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="showcase-body">
                <span className="showcase-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

// =========================================================================
// Case Studies Page (full listing + detail)
// =========================================================================
function CaseStudiesPage({ onBack }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const cs = caseStudiesData.find(x => x.id === selected)
    return (
      <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"><ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all case studies</button>
          <div className="max-w-4xl mx-auto">
            <img src={cs.image} alt={cs.title} className="rounded-2xl w-full h-72 object-cover mb-8" />
            <span className="text-xs font-bold text-primary tracking-widest uppercase">{cs.tag}</span>
            <h1 className="text-3xl font-bold mt-3 mb-4">{cs.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-text-muted mb-8">
              <span><strong>Client:</strong> {cs.client}</span>
              <span><strong>Industry:</strong> {cs.industry}</span>
              <span><strong>Duration:</strong> {cs.duration}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="text-xs text-text-muted mb-1">Challenge</div>
                <p className="text-sm">{cs.challenge}</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="text-xs text-text-muted mb-1">Solution</div>
                <p className="text-sm">{cs.solution}</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="text-xs text-text-muted mb-1">Outcome</div>
                <p className="text-sm">{cs.outcome}</p>
              </div>
            </div>
            {cs.sections.map((sec, i) => (
              <div key={i} className="mb-8">
                <h2 className="text-xl font-bold mb-3">{sec.title}</h2>
                <p className="text-text-muted leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <div className="section-head mb-12">
            <span className="eyebrow">CASE STUDIES</span>
          <h2>All Case Studies</h2>
          <p>Deep dives into how we've helped clients transform their businesses.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudiesData.map((cs) => (
            <article key={cs.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelected(cs.id)}>
              <div className="h-48 overflow-hidden">
                <img src={cs.image} alt={cs.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">{cs.tag}</span>
                <h3 className="text-lg font-bold mt-2 mb-3">{cs.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-text-muted mb-4">
                  <span><strong>Client:</strong> {cs.client}</span>
                  <span><strong>Industry:</strong> {cs.industry}</span>
                  <span><strong>Duration:</strong> {cs.duration}</span>
                </div>
                <p className="text-text-muted text-sm mb-4">{cs.outcome}</p>
                <span className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1">
                  Read case study <ArrowRightIcon size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

// =========================================================================
// Blogs Page (full listing + detail)
// =========================================================================
function BlogsPage({ onBack }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const b = blogsData.find(x => x.id === selected)
    return (
      <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"><ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all blogs</button>
          <div className="max-w-3xl mx-auto">
            <img src={b.image} alt={b.title} className="rounded-2xl w-full h-72 object-cover mb-8" />
            <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
              <span className="text-primary font-medium">{b.tag}</span>
              <span>·</span>
              <span>{b.readTime}</span>
              <span>·</span>
              <span>{b.date}</span>
            </div>
            <h1 className="text-3xl font-bold mb-6">{b.title}</h1>
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <img src={b.authorImage} alt={b.author} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{b.author}</div>
                <div className="text-sm text-text-muted">{b.authorRole}</div>
              </div>
            </div>
            <div className="text-text-muted leading-relaxed space-y-4">
              {b.content.split('. ').reduce((acc, sentence, i) => {
                if (i % 3 === 0) {
                  acc.push(b.content.split('. ').slice(i, i + 3).join('. ') + (i + 3 < b.content.split('. ').length ? '.' : ''))
                }
                return acc
              }, []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <div className="section-head mb-12">
            <span className="eyebrow">BLOGS</span>
          <h2>All Blogs</h2>
          <p>Insights on technology, design, and building great products.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogsData.map((b) => (
            <article key={b.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelected(b.id)}>
              <div className="h-44 overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                  <span className="text-primary font-medium">{b.tag}</span>
                  <span>·</span>
                  <span>{b.readTime}</span>
                </div>
                <h3 className="text-base font-bold mb-2 line-clamp-2">{b.title}</h3>
                <p className="text-text-muted text-sm line-clamp-2 mb-4">{b.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={b.authorImage} alt={b.author} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs text-text-muted">{b.author}</span>
                  </div>
                  <span className="text-xs text-text-muted">{b.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

// =========================================================================
// Careers Page (full listing + detail)
// =========================================================================
function CareersPage({ onBack }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const job = careersData.find(x => x.id === selected)
    return (
      <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"><ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all openings</button>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-text-muted">{job.department}</p>
              </div>
              <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">{job.type}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-8">
              <span className="flex items-center gap-1"><MapPinIcon size={14} /> {job.location}</span>
              <span className="flex items-center gap-1"><UsersIcon size={14} /> {job.salary}</span>
            </div>
            <div className="bg-white rounded-2xl border border-border p-8 mb-8">
              <h2 className="text-lg font-bold mb-4">About This Role</h2>
              <p className="text-text-muted leading-relaxed mb-6">{job.description}</p>
              <h2 className="text-lg font-bold mb-4">Requirements</h2>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckIcon size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              {job.niceToHave.length > 0 && (
                <>
                  <h2 className="text-lg font-bold mb-4">Nice to Have</h2>
                  <ul className="space-y-2 mb-6">
                    {job.niceToHave.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-text-muted text-sm">
                        <CheckIcon size={16} className="text-accent mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="text-center">
              <button className="btn-primary btn-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Apply for this Role <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <div className="section-head mb-12">
            <span className="eyebrow">CAREERS</span>
          <h2>Open Positions</h2>
          <p>Remote-first, people-focused. Build the future of software with us.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careersData.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(job.id)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base mb-1">{job.title}</h3>
                  <p className="text-text-muted text-sm">{job.department}</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">{job.type}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-4">
                <span className="flex items-center gap-1"><MapPinIcon size={12} /> {job.location}</span>
                <span className="flex items-center gap-1"><UsersIcon size={12} /> {job.salary}</span>
              </div>
              <button className="w-full text-center text-sm font-semibold text-primary hover:underline">
                View Details <ArrowRightIcon size={12} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// =========================================================================
// Services Page (full listing with detail expand)
// =========================================================================
function ServicesPage({ onBack, onViewDetail }) {
  return (
    <div className="min-h-screen bg-alt">
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <main className="container py-16">
          <div className="section-head mb-12">
            <span className="eyebrow">SERVICES</span>
          <h2>What We Offer</h2>
          <p>End-to-end solutions tailored to your business — from initial concept through ongoing growth.</p>
        </div>
        <div className="svc-detail-grid">
          {services.map((svc, i) => (
            <div key={svc.title} className="svc-detail-card">
              <div className="svc-detail-img">
                <img src={svc.image} alt={svc.title} />
                <div className="svc-detail-overlay">
                  <div className={`svc-icon-lg svc-icon-${svc.color}`}>
                    <svc.Icon size={36} />
                  </div>
                </div>
              </div>
              <div className="svc-detail-body">
                <h3>{svc.title}</h3>
                <div className="svc-detail-features">
                  {svc.features.map((f) => (
                    <span key={f} className="svc-feature-tag">{f}</span>
                  ))}
                </div>
                <p className="svc-detail-desc" style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {svc.tagline}
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text)' }}>{svc.projects}</strong> projects</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text)' }}>{svc.clients}</strong> clients</span>
                </div>
                <button
                  className="btn-primary mt-4"
                  style={{ width: '100%' }}
                  onClick={() => onViewDetail?.(i)}
                >
                  View Details <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// =========================================================================
// Service Detail Page
// =========================================================================
function ServiceDetailPage({ serviceIndex, onBack, onContact }) {
  const svc = services[serviceIndex]
  if (!svc) return null

  const colorMap = {
    blue:   { text: 'text-blue-500',   bg: 'bg-blue-500',   ring: 'ring-blue-500' },
    purple: { text: 'text-purple-500', bg: 'bg-purple-500', ring: 'ring-purple-500' },
    cyan:   { text: 'text-cyan-500',   bg: 'bg-cyan-500',   ring: 'ring-cyan-500' },
    green:  { text: 'text-green-500',  bg: 'bg-green-500',  ring: 'ring-green-500' },
    red:    { text: 'text-red-500',     bg: 'bg-red-500',     ring: 'ring-red-500' },
    orange: { text: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-500' },
  }
  const c = colorMap[svc.color]

  return (
    <div className="min-h-screen bg-alt">
      <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />

      <main>
        {/* Hero Banner */}
        <div style={{
          background: `linear-gradient(135deg, rgba(30,27,75,0.95) 0%, rgba(15,23,42,0.9) 100%)`,
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 24px 60px',
        }}>
          {/* Background orbs */}
          <div style={{
            position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
            background: `radial-gradient(circle, ${svc.color === 'blue' ? 'rgba(37,99,235,0.3)' : svc.color === 'purple' ? 'rgba(139,92,246,0.3)' : svc.color === 'cyan' ? 'rgba(6,182,212,0.3)' : 'rgba(37,99,235,0.3)'} 0%, transparent 70%)`,
            filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div className={`svc-icon-lg svc-icon-${svc.color}`} style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <svc.Icon size={32} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#a78bfa', textTransform: 'uppercase' }}>Service</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'white', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{svc.title}</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>{svc.tagline}</p>
            <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{svc.projects} Projects Delivered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{svc.clients} Happy Clients</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
            {/* Main Content */}
            <div>
              {/* Overview */}
              <AnimateOnScroll type="fade-up">
                <section style={{ marginBottom: 48 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Overview</h2>
                  <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7 }}>{svc.description}</p>
                </section>
              </AnimateOnScroll>

              {/* Process */}
              <AnimateOnScroll type="fade-up" delay={100}>
                <section style={{ marginBottom: 48 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Our Process</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {svc.process.map((p, i) => (
                      <div key={p.step} style={{ display: 'flex', gap: 16, padding: 20, background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(37,99,235,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{p.step}</span>
                        </div>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
                          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </AnimateOnScroll>

              {/* Technologies */}
              <AnimateOnScroll type="fade-up" delay={150}>
                <section style={{ marginBottom: 48 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Technologies We Use</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {svc.technologies.map((t) => (
                      <span key={t} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </section>
              </AnimateOnScroll>

              {/* Benefits */}
              <AnimateOnScroll type="fade-up" delay={200}>
                <section>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>What You Get</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {svc.benefits.map((b) => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'white', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <CheckIcon size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </AnimateOnScroll>
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to get started?</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>Tell us about your project and we'll create a custom proposal within 48 hours.</p>
                </div>
                <button
                  className="btn-primary btn-lg btn-block"
                  onClick={onContact}
                >
                  Get a Free Consultation <ArrowRightIcon size={16} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckIcon size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Free initial consultation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckIcon size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Custom proposal within 48h</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckIcon size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No obligation quote</span>
                  </div>
                </div>
              </div>

              {/* Other Services */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Other Services</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {services.filter((s, i) => i !== serviceIndex).slice(0, 3).map((s) => (
                    <button
                      key={s.title}
                      onClick={() => window.location.reload()}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `rgba(37,99,235,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <s.Icon size={18} style={{ color: 'var(--primary)' }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</span>
                      <ArrowRightIcon size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

// Landing page (composed)
// =========================================================================
function Landing({ user, onGoDash, onSignOut, onPrivacy, onTerms, onSecurity, onViewProjects, onViewCaseStudies, onViewBlogs, onViewCareers, onViewAbout, onViewServices }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
      <main>
        <Hero />
        <HomeProjects onViewAll={onViewProjects} />
        <HomeCaseStudies onViewAll={onViewCaseStudies} />
        <HomeBlogs onViewAll={onViewBlogs} />
        <HomeCareers onViewAll={onViewCareers} />
        <AboutSection />
        <Services onViewService={onViewServices} />
        <Milestones />
        <Global />
        <Culture />
        <Team />
        <Contact />
      </main>
      <Footer onPrivacy={onPrivacy} onTerms={onTerms} onSecurity={onSecurity} onProjects={onViewProjects} onCaseStudies={onViewCaseStudies} onBlogs={onViewBlogs} onCareers={onViewCareers} onServices={onViewServices} />
      <ChatBot />

      {/* Back to Top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 88,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
          zIndex: 100,
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: showTop ? 'auto' : 'none',
        }}
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </>
  )
}

// =========================================================================
// Auth pages (full-page sign in / sign up)
// =========================================================================
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  )
}
function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1877F2"/>
      <path fill="white" d="M13.5 22v-8h2.7l.4-3.13H13.5V8.86c0-.91.25-1.53 1.55-1.53h1.66V4.55a22 22 0 0 0-2.42-.12c-2.4 0-4.04 1.46-4.04 4.14v2.3H7.5V14h2.75v8h3.25z"/>
    </svg>
  )
}
function EyeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function EyeOffIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.83 19.83 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a19.7 19.7 0 0 1-3.17 4.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function SocialButtons({ onSocial }) {
  return (
    <div className="auth-social">
      <button type="button" className="auth-social-btn" onClick={() => onSocial?.('google')}>
        <GoogleIcon size={18} /> Continue with Google
      </button>
      <button type="button" className="auth-social-btn" onClick={() => onSocial?.('facebook')}>
        <FacebookIcon size={18} /> Continue with Facebook
      </button>
    </div>
  )
}

function OrDivider() {
  return (
    <div className="auth-or">
      <span>OR</span>
    </div>
  )
}

function AuthSidesContent({ onBack }) {
  return (
    <>
      <a href="#" className="auth-side-back" onClick={(e) => { e.preventDefault(); onBack?.() }}>
        <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Pivotal Stack
      </a>

      <div className="auth-side-banner">
        <div className="auth-side-banner-badge">
          <span className="auth-side-banner-pulse" /> Available for new projects
        </div>
        <h2>Let's build<br />something great.</h2>
        <p>Join Pivotal Stack to access our development resources, project management tools, and technical expertise.</p>
        <ul>
          <li><CheckIcon size={16} /> Custom software development</li>
          <li><CheckIcon size={16} /> Cloud architecture & DevOps</li>
          <li><CheckIcon size={16} /> AI & ML integration</li>
          <li><CheckIcon size={16} /> Ongoing support & maintenance</li>
        </ul>
      </div>

      <div className="auth-side-testimonial">
        <div className="auth-side-testimonial-stars">
          <StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} />
        </div>
        <p>"Pivotal Stack delivered our platform 3 weeks ahead of schedule. The code quality and communication were exceptional."</p>
        <div className="auth-side-testimonial-author">
          <img src={IMG.avatar1} alt="" className="auth-side-testimonial-avatar" />
          <div>
            <strong>Maya Reyes</strong>
            <span>CTO · TechScale Inc</span>
          </div>
        </div>
      </div>
    </>
  )
}

function SignInPage({ onBack, onSwitch, onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Sign in failed.')
        setLoading(false)
        return
      }
      onAuthed?.(data.user)
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running on port 5000.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <AuthSidesContent onBack={onBack} />
      </aside>
      <main className="auth-main">
        <div className="auth-card auth-card-narrow">
          <h1 className="auth-title">Sign in</h1>

          {error && <div className="auth-error">{error}</div>}

          <SocialButtons onSocial={() => alert('Social login wires in Phase 2.')} />

          <OrDivider />

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoFocus
                required
              />
            </label>
            <label className="field-label">
              Password
              <div className="field-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </label>
            <button type="button" className="link forgot-link" onClick={() => alert('Password reset coming soon. Please contact us at hello@Pivotal Stack.com')}>Forgot password?</button>
            <button
              type="submit"
              className="btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="switch">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch('signup') }}>Join Pivotal Stack</a>
          </p>
        </div>
      </main>
    </div>
  )
}

function SignUpPage({ onBack, onSwitch, onAuthed, onTerms, onPrivacy }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!agree) {
      setError('Please agree to the Terms and Privacy Policy to continue.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Sign up failed.')
        setLoading(false)
        return
      }
      onAuthed?.(data.user)
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running on port 5000.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <AuthSidesContent onBack={onBack} />
      </aside>
      <main className="auth-main">
        <div className="auth-card auth-card-narrow">
          <h1 className="auth-title">Sign up</h1>

          {error && <div className="auth-error">{error}</div>}

          <SocialButtons onSocial={() => alert('Social login wires in Phase 2.')} />

          <OrDivider />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-row">
              <label className="field-label">
                First Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  autoFocus
                  required
                />
              </label>
              <label className="field-label">
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </label>
            </div>
            <label className="field-label">
              Work email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </label>
            <label className="field-label">
              Password
              <div className="field-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </label>
            <label className="check auth-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                I agree to the Pivotal Stack{' '}
                <button type="button" onClick={onTerms} className="text-primary hover:underline">User Agreement</button> and{' '}
                <button type="button" onClick={onPrivacy} className="text-primary hover:underline">Privacy Policy</button>.
              </span>
            </label>
            <button
              type="submit"
              className="btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Join Pivotal Stack'}
            </button>
          </form>

          <p className="switch">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch('signin') }}>Log in</a>
          </p>
        </div>
      </main>
    </div>
  )
}

// Dashboard is imported above from './components/Dashboards'

// =========================================================================
// App
// =========================================================================
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { setView, setUser, setSelectedService, setCurtain } from './store/appSlice'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { view, user, selectedService, curtain } = useSelector(s => s.app)

  const changeView = (v, serviceId) => {
    const path = serviceId !== null && serviceId !== undefined ? `/${v}/${serviceId}` : `/${v}`
    navigate(path)
    dispatch(setView(v))
    if (serviceId !== null && serviceId !== undefined) dispatch(setSelectedService(serviceId))
    window.scrollTo(0, 0)
  }

  const goSignIn = () => changeView('signin')
  const goSignUp = () => changeView('signup')
  const goHome   = () => changeView('landing')
  const goDash   = (u) => { dispatch(setUser(u)); changeView('dashboard') }
  const goPrivacy = () => changeView('privacy')
  const goTerms   = () => changeView('terms')
  const goSecurity = () => changeView('security')
  const goProjects = () => changeView('projects')
  const goCaseStudies = () => changeView('casestudies')
  const goBlogs = () => changeView('blogs')
  const goCareers = () => changeView('careers')
  const goAbout = () => changeView('about')
  const goServices = () => changeView('services')
  const goServiceDetail = (i) => changeView('servicedetail', i)
  const signOut  = () => { dispatch(setUser(null)); dispatch(setView('landing')) }

  if (view === 'signin') {
    return (
      <>
        <SignInPage onBack={goHome} onSwitch={(v) => setView(v === 'signup' ? 'signup' : 'signin')} onAuthed={goDash} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'signup') {
    return (
      <>
        <SignUpPage onBack={goHome} onSwitch={(v) => setView(v === 'signin' ? 'signin' : 'signup')} onAuthed={goDash} onTerms={goTerms} onPrivacy={goPrivacy} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'privacy') {
    return (
      <>
        <LegalPage title="Privacy Policy" onBack={goHome}>
          <p className="mb-4"><strong>Last updated:</strong> June 15, 2026</p>
          <p className="mb-4">Pivotal Stack ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, such as when you request a consultation, sign up for our newsletter, or contact us through our website. This may include your name, email address, company name, phone number, and any other information you choose to provide.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, communicate with you about our services, and to comply with our legal obligations.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
          <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
          <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@Pivotal Stack.com" className="text-primary hover:underline">privacy@Pivotal Stack.com</a>.</p>
        </LegalPage>
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'terms') {
    return (
      <>
        <LegalPage title="Terms of Service" onBack={goHome}>
          <p className="mb-4"><strong>Last updated:</strong> June 15, 2026</p>
          <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of Pivotal Stack's website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing our website or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Services Description</h2>
          <p className="mb-4">Pivotal Stack provides custom software development, cloud architecture, AI integration, and related consulting services. We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Intellectual Property</h2>
          <p className="mb-4">All content, trademarks, and other materials on our website are owned by or licensed to Pivotal Stack. You may not use these materials without our prior written consent.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitation of Liability</h2>
          <p className="mb-4">To the fullest extent permitted by law, Pivotal Stack shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact</h2>
          <p>For questions about these Terms, please contact us at <a href="mailto:legal@Pivotal Stack.com" className="text-primary hover:underline">legal@Pivotal Stack.com</a>.</p>
        </LegalPage>
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'security') {
    return (
      <>
        <LegalPage title="Security" onBack={goHome}>
          <p className="mb-4">At Pivotal Stack, security is a foundational priority. We implement industry-leading practices to protect our systems and your data.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Infrastructure Security</h2>
          <p className="mb-4">Our infrastructure runs on enterprise-grade cloud providers (AWS, Azure, GCP) with SOC 2 Type II compliant data centers. All data is encrypted at rest and in transit using AES-256 and TLS 1.3.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Access Control</h2>
          <p className="mb-4">We enforce least-privilege access controls, multi-factor authentication (MFA) for all internal systems, and regular access reviews. Production access is restricted and logged.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Vulnerability Management</h2>
          <p className="mb-4">We conduct regular penetration testing, automated vulnerability scanning, and security audits. Critical vulnerabilities are addressed within 24 hours of discovery.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Incident Response</h2>
          <p className="mb-4">Our security incident response plan includes immediate notification procedures, containment protocols, and post-incident analysis. We notify affected users within 72 hours of a confirmed breach.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Report a Vulnerability</h2>
          <p>To report a security concern, please contact <a href="mailto:security@Pivotal Stack.com" className="text-primary hover:underline">security@Pivotal Stack.com</a>.</p>
        </LegalPage>
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'dashboard' && user) {
    return (
      <>
        <Dashboard user={user} onSignOut={signOut} onHome={goHome} onUserUpdate={(u) => { setUser(u) }} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'projects') {
    return (
      <>
        <ProjectsPage onBack={goHome} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'casestudies') {
    return (
      <>
        <CaseStudiesPage onBack={goHome} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'blogs') {
    return (
      <>
        <BlogsPage onBack={goHome} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'careers') {
    return (
      <>
        <CareersPage onBack={goHome} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'services') {
    return (
      <>
        <ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'about') {
    return (
      <>
        <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
        <AboutSection />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (view === 'servicedetail' && selectedService !== null) {
    return (
      <>
        <ServiceDetailPage
          serviceIndex={selectedService}
          onBack={() => { setSelectedService(null); setView('services'); window.scrollTo(0, 0) }}
          onContact={() => { setSelectedService(null); setView('landing'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
        />
        <div className={`page-curtain ${curtain}`} aria-hidden="true">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
            <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
            <div className="page-curtain-skeleton-row">
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
              <div className="page-curtain-skeleton page-curtain-skeleton-card" />
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <Routes>
      <Route path="/" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/signin" element={<SignInPage onBack={goHome} onSwitch={(v) => v === 'signup' ? goSignUp() : goSignIn()} onAuthed={goDash} />} />
      <Route path="/signup" element={<SignUpPage onBack={goHome} onSwitch={(v) => v === 'signin' ? goSignIn() : goSignUp()} onAuthed={goDash} onTerms={goTerms} onPrivacy={goPrivacy} />} />
      <Route path="/privacy" element={<LegalPage title="Privacy Policy" onBack={goHome}><p>Privacy content</p></LegalPage>} />
      <Route path="/terms" element={<LegalPage title="Terms of Service" onBack={goHome}><p>Terms content</p></LegalPage>} />
      <Route path="/security" element={<LegalPage title="Security" onBack={goHome}><p>Security content</p></LegalPage>} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} onSignOut={signOut} onHome={goHome} onUserUpdate={(u) => dispatch(setUser(u))} /> : <Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/projects" element={<ProjectsPage onBack={goHome} />} />
      <Route path="/casestudies" element={<CaseStudiesPage onBack={goHome} />} />
      <Route path="/blogs" element={<BlogsPage onBack={goHome} />} />
      <Route path="/careers" element={<CareersPage onBack={goHome} />} />
      <Route path="/services" element={<ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />} />
      <Route path="/about" element={<AboutPage onBack={goHome} />} />
      <Route path="/servicedetail/:id" element={<ServiceDetailPage onBack={() => navigate('/services')} onContact={() => navigate('/')} />} />
      <Route path="*" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
    </Routes>
  )
}

export default App