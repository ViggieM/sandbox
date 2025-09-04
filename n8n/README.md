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
- **Status**: 🟡 In Progress
- **Topics Covered**:
  - [x] What is n8n?
  - [x] Installation methods
  - [ ] First workflow creation
  - [ ] Understanding the UI

### Session 2: Core Concepts
- **Status**: ⭕ Not Started
- **Planned Topics**:
  - Nodes and connections
  - Triggers vs regular nodes
  - Data flow and transformation
  - Workflow execution

### Session 3: Expressions & Functions
- **Status**: ⭕ Not Started
- **Planned Topics**:
  - n8n expression syntax
  - Built-in functions (`$now`, `$json`, etc.)
  - Data manipulation
  - Conditional logic

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