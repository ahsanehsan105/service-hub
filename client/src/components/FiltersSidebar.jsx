"use client"

export default function FiltersSidebar({ filters, setFilters, searchQuery, onSearchChange }) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Search</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name or specialty..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Rating</h3>
        <select
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: Number.parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="0">All Ratings</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
        </select>
      </div>

      {/* Experience Filter */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Experience</h3>
        <select
          value={filters.minExperience}
          onChange={(e) => setFilters({ ...filters, minExperience: Number.parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="0">Any Experience</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setFilters({ minRating: 0, minExperience: 0, sortBy: "rating" })
          onSearchChange("")
        }}
        className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-primary/10 transition-colors font-medium"
      >
        Clear All Filters
      </button>
    </div>
  )
}
