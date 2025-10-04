# UI Components Organization

This directory contains shared UI components organized by functionality for better maintainability and discoverability.

## Structure

### `/feedback/`
Components that provide user feedback and status information.

- **ErrorBoundary.tsx** - Catches JavaScript errors and displays fallback UI
- **ErrorDisplay.tsx** - Displays error messages with different types (network, server, auth, etc.)
- **status/LoadingSpinner.tsx** - Loading indicator component
- **modals/ConfirmDeleteModal.tsx** - Confirmation modal for delete actions
- **modals/ConfirmPop-up.tsx** - General confirmation popup

### `/data-display/`
Components for displaying data and information.

- **cards/ChartCard.tsx** - Card component for displaying charts
- **cards/StatCard.tsx** - Card component for displaying statistics
- **empty-states/EmptyState.tsx** - Component shown when no data is available

### `/layout/`
Layout-related components (currently empty, ready for future use).

### `/navigation/`
Navigation-related components (currently empty, ready for future use).

### `/inputs/`
Form input components (currently empty, ready for future use).

## Usage

### Importing Components

```typescript
// Import specific components
import { ErrorBoundary, LoadingSpinner } from '@/shared/components/ui';

// Import from specific functional groups
import { ErrorDisplay } from '@/shared/components/ui/feedback';
import { StatCard } from '@/shared/components/ui/data-display';
```

### Adding New Components

When adding new UI components:

1. **Identify the functionality** - What does the component do?
2. **Choose the appropriate directory** - Place it in the most relevant functional group
3. **Update the index.ts** - Add exports to the relevant index files
4. **Follow naming conventions** - Use PascalCase for component files

### Functional Group Guidelines

- **Feedback**: Components that provide user feedback, show status, or handle errors
- **Data Display**: Components that display data, charts, tables, or information
- **Layout**: Components that affect page/section layout structure
- **Navigation**: Components for navigation, menus, breadcrumbs
- **Inputs**: Form controls, inputs, selectors, checkboxes, etc.

## Benefits

1. **Easy Discovery** - Developers can quickly find components by functionality
2. **Logical Grouping** - Related components are grouped together
3. **Scalable** - Easy to add new components without cluttering
4. **Maintainable** - Clear separation of concerns
5. **Import Efficiency** - Can import specific functional groups as needed
