# Task 6: Paper & Review Management Routes

## Status: ✅ Complete

### Commit Hash
`e3cdb4a`

### Routes Added
All 6 routes successfully registered in `routes/web.php`:

```
  GET|HEAD  admin/api/papers .................................................... PaperReviewController@getPapersTable
  GET|HEAD  admin/api/papers/{id} ............................................... PaperReviewController@getPaperDetail
  PUT       admin/api/papers/{id}/status ..................................... PaperReviewController@updatePaperStatus
  GET|HEAD  admin/api/reviewers ............................................... PaperReviewController@getReviewersList
  GET|HEAD  admin/papers-review .................................... admin.papers-review ??? PaperReviewController@index
  GET|HEAD  admin/api/papers-review/metrics ................................ PaperReviewController@getDashboardMetrics
```

### Changes Made
- Added `PaperReviewController` import to `routes/web.php`
- Added 1 named page route: `/papers-review`
- Added 5 API endpoints for Paper Review management
- All routes protected by `auth` and `role:super_admin` middleware
- Routes follow naming convention: `admin.papers-review` for page route

### Verification
- ✅ Route list shows all 6 endpoints
- ✅ All routes inherit admin middleware protection
- ✅ Committed with message: "feat: add paper review routes to web.php"
