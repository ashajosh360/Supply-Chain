import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const SearchHeader = ({ 
  searchQuery, 
  onSearch, 
  suggestions = [], 
  onToggleFilters, 
  isFilterOpen 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (searchQuery && isSearchFocused) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, suggestions, isSearchFocused]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(filteredSuggestions[selectedSuggestionIndex]);
        } else if (searchQuery.trim()) {
          setShowSuggestions(false);
          setIsSearchFocused(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setIsSearchFocused(false);
        searchRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onSearch(suggestion.value);
    setShowSuggestions(false);
    setIsSearchFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleClearSearch = () => {
    onSearch('');
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'tracking': return 'Package';
      case 'customer': return 'Building2';
      case 'route': return 'Route';
      default: return 'Search';
    }
  };

  const getSuggestionTypeLabel = (type) => {
    switch (type) {
      case 'tracking': return 'Tracking ID';
      case 'customer': return 'Customer';
      case 'route': return 'Route';
      default: return 'Search';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={20} className="text-text-secondary" />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search by tracking ID, customer name, or route..."
              className={`
                w-full pl-10 pr-12 py-3 text-sm border rounded-lg transition-all duration-200
                ${isSearchFocused 
                  ? 'border-primary ring-2 ring-primary-100 bg-surface' :'border-border bg-surface hover:border-border-dark'
                }
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100
              `}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
              >
                <Icon name="X" size={18} />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-dropdown max-h-64 overflow-y-auto animate-slide-down"
            >
              <div className="py-2">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.value}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`
                      w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors duration-150
                      ${index === selectedSuggestionIndex 
                        ? 'bg-primary-50 text-primary' :'text-text-primary hover:bg-surface-50'
                      }
                    `}
                  >
                    <Icon 
                      name={getSuggestionIcon(suggestion.type)} 
                      size={16} 
                      className={index === selectedSuggestionIndex ? 'text-primary' : 'text-text-secondary'} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.label}</p>
                      <p className="text-xs text-text-secondary">{getSuggestionTypeLabel(suggestion.type)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFilters}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200
              ${isFilterOpen 
                ? 'bg-primary text-white border-primary' :'bg-surface text-text-primary border-border hover:bg-surface-50 hover:border-border-dark'
              }
            `}
          >
            <Icon name="Filter" size={18} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-50 hover:border-border-dark transition-all duration-200">
            <Icon name="Download" size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary-700 transition-all duration-200">
            <Icon name="Plus" size={18} />
            <span className="hidden sm:inline">Track New</span>
          </button>
        </div>
      </div>

      {/* Search Tips */}
      {isSearchFocused && !searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-dropdown animate-slide-down">
          <div className="p-4">
            <p className="text-sm font-medium text-text-primary mb-2">Search Tips:</p>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Enter tracking ID (e.g., MSK-2024-001847)</li>
              <li>• Search by customer name or code</li>
              <li>• Use origin or destination cities</li>
              <li>• Try carrier names (Maersk, COSCO, etc.)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;