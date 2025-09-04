# n8n Learning Journey 🚀

Welcome to our step-by-step exploration of n8n, Viggie Smalls! This document tracks our learning progress as we discover the powerful world of workflow automation.

## What is n8n?

n8n is a **workflow automation platform** that connects anything to everything. It's:
- **Fair-code licensed** with a free community edition
- **Self-hostable** or available as a cloud service
- **Visual workflow builder** with 400+ integrations
- **Code-friendly** - offers flexibility of code with no-code speed
- **AI-enabled** with native AI capabilities

## Learning Objectives

- [ ] Understand n8n's core concepts and terminology
- [ ] Learn how to create and manage workflows
- [ ] Explore triggers, nodes, and data flow
- [ ] Master n8n expressions and built-in functions
- [ ] Build practical automation examples
- [ ] Understand integration patterns
- [ ] Explore AI workflow capabilities

## Prerequisites

- **n8n Access**: We'll use either [n8n Cloud](https://n8n.io) (free trial) or self-hosted
- **Basic Understanding**: Familiarity with APIs and data flows (helpful but not required)
- **Curiosity**: Ready to explore and experiment!

## Installation Options

### Quick Start (No Installation)
```bash
npx n8n
```
*Access via http://localhost:5678*

### Docker (Recommended for Self-Hosting)
```bash
# Create persistent volume
docker volume create n8n_data

# Run n8n container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE="UTC" \
  -e TZ="UTC" \
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
  -e N8N_RUNNERS_ENABLED=true \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

### NPM Installation
```bash
npm install n8n -g
n8n start
```

## 📚 Learning Progress

### Session 1: Getting Started
- **Status**: 🟢 Complete
- **Topics Covered**:
  - [x] What is n8n?
  - [x] Installation methods
  - [x] Installation troubleshooting
  - [x] Environment setup
  - [x] First workflow creation
  - [x] Understanding the UI

#### Installation Issues & Solutions ⚠️
**Problem**: When installing n8n globally via pnpm, encountered SQLite dependency errors:
```
SQLite package has not been found installed. Try to install it: npm install sqlite3 --save
```

**Root Cause**: pnpm's global installation doesn't properly handle sqlite3 dependency resolution for n8n.

**Solution Steps**:
1. **Uninstall pnpm version**: `pnpm uninstall -g n8n`
2. **Install via npm instead**: `npm install n8n -g` (proper dependency handling)
3. **Fix config permissions**: `chmod 600 ~/.n8n/config` (was 0664, too permissive)
4. **Successfully started**: n8n now accessible at http://localhost:5678

**Key Learnings**:
- npm handles n8n dependencies better than pnpm for global installations
- n8n requires strict config file permissions (600) for security
- Version 1.109.2 includes comprehensive database migration system
- Several environment variables have deprecation warnings for future versions

**Environment Variable Recommendations**:
```bash
# For better SQLite performance
export DB_SQLITE_POOL_SIZE=5

# Enable task runners (will be default in future)
export N8N_RUNNERS_ENABLED=true

# Control environment variable access in nodes
export N8N_BLOCK_ENV_ACCESS_IN_NODE=false
```

#### First Workflow Experience ✨
**Workflow Built**: "Hello World with Data Processing"
- **Nodes Used**: Manual Trigger → Edit Fields → Code → HTTP Request
- **Duration**: ~20 minutes
- **Test API**: httpbin.org/post (perfect for testing HTTP requests)

**Key Learnings**:
- **Node Canvas**: Intuitive drag-and-drop interface for building workflows
- **Data Flow**: Information flows left-to-right between connected nodes as JSON objects
- **Expression Syntax**: `{{ $json }}` passes all data from previous node; `{{ $json.propertyName }}` for specific fields
- **Manual Triggers**: Perfect for testing workflows before adding automatic triggers
- **Code Nodes**: Powerful for data transformation using JavaScript/Python
- **HTTP Requests**: Easy integration with external APIs and services
- **Real-time Testing**: Can execute individual nodes or entire workflows instantly

**Data Transformation Example**:
```javascript
// Input: { customerName: "John Doe", customerEmail: "john.doe@example.com", orderTotal: "99.99" }
// Code Node Processing:
{
  processedAt: "2025-09-04T08:42:41.901Z",
  customerInfo: {
    name: "JOHN DOE",           // Converted to uppercase
    email: "john.doe@example.com",
    orderValue: 99.99           // Converted string to number
  },
  summary: "Customer John Doe has an order worth $99.99"
}
```

**Success Indicators**:
- ✅ Workflow executed without errors
- ✅ Data transformations worked as expected
- ✅ HTTP request successfully sent and received response
- ✅ JSON structure preserved through all nodes

### Session 2: Core Concepts
- **Status**: 🟢 Complete
- **Topics Covered**:
  - [x] Triggers vs regular nodes
  - [x] Advanced expressions and functions
  - [x] Error handling and debugging
  - [x] Conditional logic (IF/Switch nodes)

#### Key Workflows Built 🛠️
1. **"Daily Weather Alert"** - Schedule Trigger + HTTP Request + Code transformation
2. **"Expression Testing Lab"** - Advanced expressions with time, conditionals, metadata
3. **"Error Handling Practice"** - Intentional failures + "Continue on Fail" + error detection
4. **"Smart Task Processor"** - Multi-path conditional logic with Switch node

**Major Learnings**:
- **Trigger Types**: Manual (testing), Schedule (automation), Webhook (real-time), Poll (monitoring)
- **Advanced Expressions**: `{{ $now }}`, `{{ $workflow.name }}`, conditional logic `{{ condition ? 'true' : 'false' }}`
- **Error Handling**: "Continue on Fail" setting, `{{ $json.error }}` detection, graceful degradation
- **Conditional Logic**: IF nodes for simple branching, **Switch nodes for multiple conditions** (more efficient)
- **Workflow Patterns**: Trigger → Process → Branch → Merge → Output

**Key Built-in Variables Mastered**:
```javascript
{{ $now }}                    // Current timestamp with Luxon formatting
{{ $today }}                  // Today's date
{{ $workflow.id }}            // Workflow metadata access
{{ $node["NodeName"].json }}  // Cross-node data reference
{{ $itemIndex }}              // Loop iteration tracking
{{ Math.random() * 100 }}     // JavaScript functions in expressions
```

**Optimization Discovery**: Independently chose Switch node over multiple IF nodes for cleaner multi-condition workflows ⚡

### Session 3: Real-World Integrations
- **Status**: ⭕ Not Started
- **Planned Topics**:
  - Webhook triggers and API endpoints
  - Service integrations (Gmail, Slack, databases)
  - Data transformation patterns
  - Background automation (activated workflows)

### Session 4: Practical Examples
- **Status**: ⭕ Not Started
- **Planned Topics**:
  - Simple automation workflows
  - API integrations
  - Data processing examples
  - Error handling

### Session 5: Advanced Features
- **Status**: ⭕ Not Started
- **Planned Topics**:
  - AI workflows
  - Custom nodes
  - Webhook triggers
  - Scheduled workflows

## 🔧 Key Concepts

### Workflow Components
- **Trigger Nodes**: Start workflows (webhooks, schedules, manual triggers)
- **Regular Nodes**: Process data (HTTP requests, transformations, integrations)
- **Data Flow**: Information passes between nodes as JSON objects

### Built-in Functions & Expressions
```javascript
// Current timestamp
$now

// Access node data
$json.propertyName

// Previous node data
$node["NodeName"].json

// Workflow metadata
$workflow.id
$execution.id
```

### Expression Syntax Examples
```javascript
// Dynamic message creation
Hi {{ $json.customer_name }}. Your description is: {{ $json.customer_description }}

// Conditional logic
{{ $json.status === 'active' ? 'Welcome!' : 'Please activate your account' }}

// Data transformation
{{ $json.items.length }}
```

## 🛠 Code Examples

*This section will grow as we explore n8n together*

### Basic Workflow Structure
```json
{
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Process Data",
      "type": "n8n-nodes-base.code"
    }
  ]
}
```

## 📖 Resources

### Official Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [Getting Started Guide](https://docs.n8n.io/try-it-out/quickstart/)
- [Node Reference](https://docs.n8n.io/integrations/)
- [Expression Reference](https://docs.n8n.io/code/)

### Community & Templates
- [Workflow Templates](https://n8n.io/workflows/)
- [Community Forum](https://community.n8n.io/)
- [GitHub Repository](https://github.com/n8n-io/n8n)

### Learning Resources
- [n8n Courses](https://docs.n8n.io/courses/)
- [Level 1 Course](https://docs.n8n.io/courses/level-one/)
- [AI Workflow Examples](https://docs.n8n.io/advanced-ai/examples/)

## 🎯 Next Steps

1. **Start with Quickstart**: Follow the official quickstart guide
2. **Build First Workflow**: Create a simple automation
3. **Explore Templates**: Use existing workflows as learning examples
4. **Join Community**: Connect with other n8n users
5. **Advanced Features**: Dive into AI workflows and custom nodes

## 📝 Notes & Questions

*This section will capture our discoveries, questions, and insights as we learn together*

---

**Learning Session Legend:**
- 🟢 **Complete**: Mastered and ready to move on
- 🟡 **In Progress**: Currently exploring
- ⭕ **Not Started**: Planned for future sessions
- 🔴 **Need Review**: Requires additional attention

*Last Updated: 2025-09-04*