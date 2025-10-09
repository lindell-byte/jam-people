"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function LookupForm() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [projectFound, setProjectFound] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    eventType: '',
    contactPerson: '',
    clientContactNo: '',
    clientEmail: '',
    quoteSource: '',
    xeroContact: '',
    location: '',
    startDate: '',
    endDate: '',
    accountManagerInitials: ''
  });

  const [roles, setRoles] = useState<Array<{
    id: string;
    role: string;
    quantity: string;
    gender: string;
    language: string;
    hourlyRate: string;
    fixedOutgoingRate: string;
  }>>([
    {
      id: '1',
      role: '',
      quantity: '',
      gender: '',
      language: '',
      hourlyRate: '',
      fixedOutgoingRate: ''
    }
  ]);

  const [timeSlots, setTimeSlots] = useState<{[key: string]: {startTime: string, endTime: string}}>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Xero Contact autocomplete suggestions - UAE
  const uaeXeroContactSuggestions = [
    "Wilson Fletcher Limited", "Tarfat Alebdaa Co. (Blink)", "EV Real Estate Brokerage LLC", "Arcade Designs and Exhibitions LLC",
    "Swift Creatives", "Test", "Waldorf Astoria Hotel Dubai Palm Jumeirah", "Rely Industries FZCO", "Apex Trading", "Soulflex",
    "Akinbiyi Group FZE", "Apex Scaffolding LLC", "Blink Experience LLC", "Bruno Marx Management Consultancy FZE",
    "Aston GB General Trading Co LLC", "Calcium Advertising & Publicity LLC", "Gallowglass Health and Safety ME LLC",
    "Mamemo Productions", "Mosaic Live Communications LLC", "Noble Events Limited", "Premier Sports LLC",
    "Enata Aerospace FZC", "Enata Industries FZE", "Enata Marine FZC", "Equitativa (AD) Limited",
    "Equitativa (Dubai) Limited", "Platre.com", "The Residential REIT (IC) Limited", "V2 Studios Limited",
    "Festember FZ LLC", "Timata Marketing Limited", "Art Dubai Fair FZ LLC", "TEC Worldwide DMCC",
    "Trifork eHealth ApS", "Link Viva FZ LLC", "Emirates REIT (CEIC) PLC", "Republic of Design & Events LLC",
    "Global Finance Attention: Joseph Giarraputo Global Finance Magazine 7 East 20th Street New York NY 1003 USA",
    "FFWD FZ LLC", "Alvia Events LLC", "Door Global Limited", "Prisme International LLC", "GEM Event Management",
    "Done LLC", "Production Technology LLC", "Osool Entertainment Investment Company", "Casa Serai Resorts Pvt Ltd",
    "Top Gear Promotions LLC (Events)", "Dynamic Motion LLC", "Artspot Techinical Services LLC", "CREA/TORS",
    "ARGA FZ LLC", "Gems Wellington International School", "Platform 3 Fitness LLC", "Sela Sports",
    "Event Works Inc", "THE ONLOOKER DWC LLC", "Imagination Middle East Limited Dubai Branch",
    "Apollo Events Capsule", "Wicked Tents LLC", "Flagship Projects FZ LLC", "Auditoire Event Management LLC",
    "10up Inc", "Brag Two FZ LLC", "UCP Entertainment Pte Ltd (Abu Dhabi Branch)", "Tait Stage Technologies LLC",
    "Method Europe Ltd", "Al Fares Intl.Tents", "Arena Events Limited - Dubai Branch",
    "Level Production Exhibition Organizing", "MMG KSA", "CASAMILAN FZ LLE", "Plan B Events LLC.",
    "EventsCase Ltd", "Luxury KSA", "Eagle Eye Interior Design LLC", "Alamiya", "Yas Bay Arena - Sole Proprietorship L.L.C.",
    "Mediapro International LLC", "Activate The Events Agency LLC", "Miral Asset Management",
    "DXB Live, DWTC, Dubai", "TIME Entertainment", "Global Manufacturing Organisation Limited",
    "Yas Marina LLC", "MEI General Trading Co LLC", "Energie Entertainment FZ LLE",
    "Kingdom of Norway Pavilion - Expo 2020 Dubai", "FiveCurrents, LLC (DWTCA Branch)",
    "Lowe Refrigeration LLC", "Rapiscan Systems Electrical Trading LLC",
    "Redfilo Events Exhibitions Organizing - LLC", "Neumann & Mueller Event Technology LLC",
    "Growthry Events", "Al Sayegh Media", "Gyro. AS", "VAV Middle East FZ LLC", "INVNT DMCC",
    "Wood Zone Technical Works LLC", "Blip Event Management LLC", "Freshly Minced Events Consultants",
    "Yas Asset Management LLC", "Extreme International", "THE QODE FZ LLC",
    "EXPOMOBILIA MCH GLOBAL ME LIVE MARKETING L.L.C", "Masaahaat", "Viola Communications LLC",
    "Falcon Golf Management Ltd", "Arena Saudi Company- KSA Branch", "Richard Attias & Associates",
    "Pico International Exhibitions and Events Organizing LLC", "Eventify Entertainment Event Management",
    "Ahmed Seddiqi & Sons LLC", "Quintessentially DMCC", "DNV AS", "ABU DHABI MOTOR SPORTS MANAGEMENT- L L C",
    "Mima Group Limited", "National Events Centre", "Bliss FZCO",
    "Palazzigas Middle East Event Managment L.L.C.", "URBAN WORLD WIDE EVENTS L.L.C", "TAKELEAP DMCC",
    "Canada Pavilion – Expo 2020 Dubai – EXP-0041", "Pure Science Limited", "Stamina Productions LLC",
    "Auditoire (France)", "Marvels FZ-LLC", "Saudi Automobile and Motorcycle Federation (SAMF)",
    "SERAAT EL ENJAZ PRODUCTION", "The Planners Event Management", "Drive Global",
    "Imagination Middle East LLC (Qatar)", "Chime Sport and Entertainment Middle East FZ-LLC (CSM Dubai)",
    "Three Monkeys Creative Consulting FZ LLC", "Pulse Middle East Trading LLC",
    "Losberger De Boer Trading and Contracting L.L.C", "Balich Wonder Studio KSA", "A RAW Concept",
    "ABU DHABI CRICKET CLUB", "CSM Sport and Entertainment Middle East FZ LLC", "GL events Doha QFC Branch",
    "Flash Entertainment FZ LLC", "Unigraf LLC", "arts & melon", "GL events Doha SPC LLC",
    "NOVELTY MIDDLE EAST AUDIO VISUAL EQUIPMENT LLC", "AYA HYPERSPACE AMUSEMENT PARK L.L.C", "SA HAVAS PARIS",
    "Ahmad Helmiz", "VISION DIVISION EVENTS MANAGMENT", "Prolab Digital L.L.C", "HIGH AND WIRED EVENTS L.L.C",
    "Looking Glass Events FZ LLC", "Emirates Leisure Retail ( LLC )", "People FZ LLC", "Fractal systems FZ LLC",
    "LSV Middle East LLC (GAG)", "Catapult Limited", "NOBLE EVENTS LIMITED (DMCC BRANCH)",
    "Red Door 54 Event Management LLC", "WMP Creative (William Martin Qatar)", "Jack Morton Worldwide Ltd.",
    "Nightowl (FZE)", "Peregrine and Co LLC", "Enginious LLC FZ", "Pole Position", "Sail GP Dubai",
    "BLACK DWC-LLC", "Fédération Internationale de Football Association", "M Premiere FZ-LLC",
    "Department of Culture and Tourism", "WHITE RABBIT CREATIVE LLC", "Forward Sports", "VW Volleyball World SA",
    "Messe Frankfurt Middle East GmbH", "Executive Visions Inc.", "HQ Worldwide Shows",
    "MICE International Events Management Services", "CSM Sports and Entertainment LLP / CSM Live UK",
    "Openlab Marketing Management LLC", "Desert Snow Special Effects Production LLC",
    "Plus Four Four Events FZC", "EXECUTIVE VISIONS EMEA DMCC DUBAI BRANCH", "Beatrice FZ LLC",
    "Accrued Revenue", "ADVANCE MAGAZINE PUBLISHERS INC", "Light Blue LLC", "FOOTPRINT LLC", "OR Media",
    "Event Lab FZ LLC", "Khudairi Trading & Contracting Solutions LLC", "Geometry Global Advertising LLC",
    "Imagination Europe Ltd.", "MCM PRODUCTIONS LTD", "Binghatti Developers FZE", "DUBAI ARENA OPERATIONS L.L.C",
    "Orientations Exhibition and Conference Organiser LLC", "MARCOMLUX EVENTS L.L.C",
    "Evolution Live Events Management LLC", "THE SOCIAL EFFECT L.L.C-FZ", "Atelier LUM",
    "Balich Wonder Studio S.p.A.", "The Fridge Entertainment", "F50 League LLC", "Nirvana Travel & Tourism LLC",
    "Monokoto Ltd", "Fortune Media IP Limited", "Al Deyafa Oasis Trading",
    "Mazarine La Mode en Images Middle East FZ-LLC", "Silliss Event Management L.L.C", "iRIG Events Organizer LLC",
    "Global Experience Specialists", "Marble Apparel", "Brag FZ-LLC", "ALTAIR PASSENGER TRANSPORT LLC",
    "Young & Rubicam FZ-LLC", "GLOBE SOCCER DWC LLC", "Proud-Robinson Ltd",
    "MAESTRA EXHIBITION STANDS MANUFACTURING L.L.C", "PLATINUM BY DG EVENTS L.L.C", "ETHARA Sole Proprietorship LLC",
    "Expo City Dubai FZCO", "THE HANGING HOUSE EXPERIENTIAL EVENTS L.L.C", "Avantgarde Brand Events Services LLC",
    "Artists In Motion Middle East DWC-LLC", "World Iconic Events LLC", "Lima Management Consulting",
    "Launch Limited", "Trivandi DMCC", "Venture Lifestyle Events", "Techsquare IT Solutions",
    "OP3 Events LLC", "O K Middle East Productions", "The Premium Booker", "Driving Force Advertising LLC",
    "Weber Shandwick FZ LLC", "IVORY Worldwide Limited", "AGB Events PTY LTD", "The Be So Group",
    "Done and Dusted Productions Limited", "Imosion Events and Marketing LLC", "Energie Entertainment Events LLC",
    "Freshly Minced Live FZCO", "S.L.S PRODUCTION EQUIPMENT L.L.C", "Nomada Trading LLC",
    "THE AUDIENCE MOTIVATION COMPANY ASIA FZ LLC", "Leaders Production FZ LLC", "AMC ASIA FZ LLC",
    "J A Resorts & Hotels LLC", "Live Nation Middle East FZ LLC", "Evolution Interiors Decoration LLC",
    "Glow Power Equipment Rental LLC", "Avantgarde Brand Services FZ LLC", "Enigma Live FZ LLC",
    "Traders Hub Currency Brokerage Sole Proprietorship LLC", "Salute LLC", "P P S Consultancy LLC",
    "Build Up Exhibition Fixtures LLC", "Cosmopole Communications", "DREAM MASTER ENTERTAINMENT & EVENTS",
    "Naya Artificial Flowers & Plants Trading Co. LLC", "Front Row Events LLC", "Executive Visions Emea DMCC",
    "JAM Company for Entertainment Services", "Societe Pourl Expansion Des Ventes Des Produits Agricoles Alimentaires Sopexa (Dubai Branch)",
    "AD Studio", "The Experience by Richard Attias FZ LLC", "Mwan Events & Technology LLC",
    "The Other Guyz DMCC", "Jets Capital Events and Organizing and Managing Est.", "Lusail Circuit Sports Club",
    "Touring Experiences Middle East FZ LLC", "Beatport LLC", "Backbone Europe B.V.", "Type A FZ LLC",
    "Black Orange Entertainment Services LLC", "Class Act Events LLC", "ALTEA AGENCY LLC",
    "Uniplan Events Organizing & Managing LLC", "SM Productions Events LLC", "Posh Event Rentals LLC",
    "Special Projects Studio Ltd", "UNIFORMSTORE UNIFORMS TRADING LLC", "Jack Morton Worldwide FZ LLC",
    "Sosai Event Organizers FZE", "Safarak Travel and Tourism LLC", "Atelier Luxury Gulf LLC",
    "Leme Profirst Middle East Events Management LLC", "The Independents FZ LLC", "Memories Events Managment LLC",
    "MMS Communications FZ LLC", "Sleek Events", "WorldSport Arabia FZ LLC", "Abu Dhabi Cricket and Sports Hub",
    "Akana Collective LLC FZ", "Marketing Options FZ-LLC", "George P. Johnson FZ-LLC", "D&F Creative Limited",
    "Flash Services L.L.C", "InGenius Productions Ltd", "Identity Events Management Sole Proprietorship LLC",
    "Identity Events Management - Sole Proprietorship LLC", "Identity Holdings Limited",
    "WVC Middle East Events Organizing & Managing LLC", "Profirst Events Management-L.L.C",
    "Stella Enterprises Limited", "Mettle Studio Ltd", "All Things Live Middle East FZ-LLC",
    "Dazzle & Fizz Creative Arabia for Events and Activations LLC", "Timeless Events",
    "MA PARTIES & ENTERTAINMENTS SERVICES", "Wizcraft Global Events", "BE Experiential Events FZ LLC",
    "DXB Bev Business Enterprise L.L.C-FZ", "SAS Express", "Nomada Events Organizing & Managing LLC",
    "JLC Productions Middle East FZ LLC", "Creative Pocket", "Trio Collective Events LLC",
    "LINKVIVA EVENTS MANAGEMENT L.L.C.", "RIPE EXHIBITION ORGANIZER CO LLC",
    "Identity Events Management - Sole Proprietorship LLC - Dubai Branch", "Sight Network Events Organizing & Managing LLC",
    "UAE Wrestling Federation - Sole Proprietorship LLC", "Bluecherry Events LLC", "Room-Five DMCC",
    "Prince Audio Visuals LLC", "ART PRODUCTION UNIT FZ LLC", "Hoko World DMCC", "BE MORE EVENTS CO. L.L.C",
    "Mosaic Live Events Management LLC", "Done and Dusted Middle East FZ LLC", "ZINC MEDIA GROUP PLC",
    "Populate Group Ltd", "SOLAS ENTERTAINMENTS SERVICES LLC", "ANY", "STUDIO BOUM LIMITED",
    "Auditoire Qatar WLL", "THE ORIGINALS EVENTS MANAGEMENT L.L.C", "MAD MARKS EVENTS & MARKETING MANAGEMENT",
    "Daylight Bureau L.L.C-FZ", "H P X EXPERIENCE GENERAL TRADING - L.L.C - S.P.C", "Bottega Veneta Arabia Trading LLC",
    "Katch Events Sole Proprietorship LLC", "UNLESS AGENCY", "Be Veneta Luxury House Trading LLC",
    "Falcon and Associates LLC FZ", "Proactiv Entertainment FZ LLC.", "Breitling AG",
    "Falcon and Associates L.L.C-FZ Dubai Branch", "PRG EVENT SERVICES L.L.C", "L Agence FZC", "fischerAppelt Marketing WLL"
  ];

  // Xero Contact autocomplete suggestions - KSA
  const ksaXeroContactSuggestions = [
    "Maestra Services Limited Maintenance Company",
    "Maestra KSA",
    "Pico International For Event & Expo",
    "Alpha Plus Advertising Company",
    "Informa Saudi Arabia Limited",
    "Trivandi International Contracting Company",
    "EFM Global Logistics Services",
    "Imagination Saudi Arabia LLC",
    "Al Roya Department Foundation for Entertainment Events",
    "Auditoire for organizing exhibitions and conferences for one person",
    "Modern Transformation LLC",
    "Moments International",
    "Sama Al-Kon Advertising Company",
    "Inspire Entertainment Events Company",
    "Saudi Motorsport Company",
    "Tait Arabia for Entertainment Events LLC",
    "Red Sea Film Festival Foundation",
    "TIME Entertainment",
    "CSM Sports Company",
    "Kaoun Arabia For Entertainment LLC",
    "Saudi Ajwaa Foundation for Organizing Exhibitions and Conferences",
    "Business Innovative Gateway Entertainment Company",
    "Done & Dusted (UK)",
    "Done and Dusted X Limited",
    "شركة الدورة الكاملة للفعاليات الترفيهية",
    "BLACK ARABIA ENTERTAINMENT EVENTS LLC",
    "Avantgarde Brand Services FZ LCC",
    "Regenerative Escapes Tourism Company",
    "Branch of SM Pro & Decisions Events LLC",
    "Balich Wonder Studio KSA",
    "Energie Entertainment Middle East For Entertainment Events",
    "TAIT MENA For Entertainment LLC",
    "Special Projects Arabia",
    "Red Sea International Company",
    "Thamer Abdul Qadir Suleiman Al khiraiji Company for Advertising & Publicity",
    "TECH HEIGHTS",
    "Quintessentially Arabia LLC",
    "Quad Professionals for Organizing and Holding Exhibitions",
    "Leaders Production LLC Branch",
    "Memories Events Managements",
    "Richard Attias & Associates",
    "ASAS MASDAR AL-AHTARAFIYA (One Partner)",
    "Identity Growth Company for Business Services",
    "Establishment FAALIA RAIA Organizing Exhibitions and Conferences",
    "Dom United Trading",
    "Creative system for wood industries branch of AWJ Smart Limited",
    "MDL Beast LLC",
    "Stamina Productions Company for Management of Exhibitions and Conferences",
    "Tarfat Alebdaa Co",
    "AWJ Smart Company Limited",
    "FAA ALF Organizing Exhibitions and Conferences LLC",
    "Fortune Media IP Limited",
    "AUGE AL-DHAKIA Ltd",
    "Linkviva Company",
    "Diriyah Company",
    "Vision Strategy Marketing Company",
    "ITP Media Saudi Limited",
    "Done and Dusted Co. Ltd",
    "Bottega Veneta Arabia Trading LLC",
    "Posh Event Rentals LLC",
    "Masaahaat",
    "Sample Customer JR",
    "SERAAT EL ENJAZ PRODUCTION",
    "NOVELTY FRANCE CO. BRANCH",
    "RSS Saudi Company Limited",
    "Pioneer Event LLC",
    "NEOM Inc.",
    "JAM KSA",
    "SUNNA ALEBTHIKAR LETARFEH CO",
    "Havas Paris Branch",
    "Albert Promoseven Media & Advertisement and Public Relation CO. LTD",
    "Ghada Abbas Ghazzawi Foundation for Organizing Exhibitions and Conference (GAG)",
    "ACCIONA Producciones y Diseño Arabia LLC",
    "Al-Harithy Company for Exhibitions Ltd",
    "Arena Saudi Company- KSA Branch",
    "HQ Worldwide Shows Saudi Company Limited for Organization of Exhibitions and Conferences",
    "Extreme International",
    "LEAD ENTERPRISE",
    "Luxury KSA",
    "Sela Company"
  ];

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear suggestions when quote source changes
  useEffect(() => {
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setSelectedSuggestionIndex(-1);
    setFormData(prev => ({ ...prev, xeroContact: '' }));
  }, [formData.quoteSource]);

  // Function to search for project by ID
  const handleSearchProject = async () => {
    if (!projectId.trim()) {
      setSearchError('Please enter a project ID');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setProjectFound(false);

    try {
      // Replace this URL with your n8n GET webhook URL
      const webhookUrl = `https://jamlive.app.n8n.cloud/webhook/jam-people-lookup?projectId=${encodeURIComponent(projectId)}`;
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Populate form with fetched data
        setFormData({
          clientName: data.clientName || '',
          projectName: data.projectName || '',
          eventType: data.eventType || '',
          contactPerson: data.contactPerson || '',
          clientContactNo: data.clientContactNo || '',
          clientEmail: data.clientEmail || '',
          quoteSource: data.quoteSource || '',
          xeroContact: data.xeroContact || '',
          location: data.location || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          accountManagerInitials: data.accountManagerInitials || ''
        });

        // Populate roles if they exist
        if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
          setRoles(data.roles.map((role: {
            role?: string;
            quantity?: string;
            gender?: string;
            language?: string;
            hourlyRate?: string;
            fixedOutgoingRate?: string;
          }, index: number) => ({
            id: (index + 1).toString(),
            role: role.role || '',
            quantity: role.quantity || '',
            gender: role.gender || '',
            language: role.language || '',
            hourlyRate: role.hourlyRate || '',
            fixedOutgoingRate: role.fixedOutgoingRate || ''
          })));
        }

        // Populate time slots if they exist
        if (data.timeSlots) {
          setTimeSlots(data.timeSlots);
        }

        setProjectFound(true);
        setSearchError('');
      } else {
        setSearchError('Project not found. Please check the project ID and try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(`Error: ${error instanceof Error ? error.message : 'Failed to fetch project data'}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to get all dates between start and end date (inclusive)
  const getDatesInRange = (startDate: string, endDate: string): string[] => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    
    if (start > end) return [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Function to format date for display
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-capitalize Account Manager Initials
    if (name === 'accountManagerInitials') {
      const capitalizedValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: capitalizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Clear time slots when dates change
      if (name === 'startDate' || name === 'endDate') {
        setTimeSlots({});
      }
    }
  };

  // Handle role changes
  const handleRoleChange = (roleId: string, field: keyof typeof roles[0], value: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, [field]: value } : role
    ));
  };

  // Add new role
  const addRole = () => {
    const newRoleId = Date.now().toString();
    setRoles(prev => [...prev, {
      id: newRoleId,
      role: '',
      quantity: '',
      gender: '',
      language: '',
      hourlyRate: '',
      fixedOutgoingRate: ''
    }]);
  };

  // Remove role
  const removeRole = (roleId: string) => {
    if (roles.length > 1) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  // Handle time slot changes
  const handleTimeSlotChange = (date: string, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value
      }
    }));
  };

  // Xero Contact autocomplete handlers
  const getCurrentSuggestionsArray = () => {
    return formData.quoteSource === 'JAM KSA' ? ksaXeroContactSuggestions : uaeXeroContactSuggestions;
  };

  const handleXeroContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, xeroContact: value }));

    // Only show suggestions if a quote source is selected
    if (value.length > 0 && formData.quoteSource) {
      const currentSuggestions = getCurrentSuggestionsArray();
      const filtered = currentSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleXeroContactSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, xeroContact: suggestion }));
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    inputRef.current?.focus();
  };

  const handleXeroContactKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
          handleXeroContactSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleXeroContactFocus = () => {
    if (formData.xeroContact.length > 0 && formData.quoteSource) {
      const currentSuggestions = getCurrentSuggestionsArray();
      const filtered = currentSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(formData.xeroContact.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    }
  };

  const handleXeroContactBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Replace this with your n8n UPDATE webhook URL
      const webhookUrl = 'https://jamlive.app.n8n.cloud/webhook/jam-people-update';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          ...formData,
          roles: roles,
          timeSlots: timeSlots
        }),
      });

      if (response.ok) {
        setSubmitMessage('Project updated successfully!');
      } else {
        const errorText = await response.text();
        setSubmitMessage(`Error ${response.status}: ${response.statusText}. ${errorText ? `Details: ${errorText}` : 'Please check the webhook configuration.'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      setSubmitMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and webhook URL.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-16">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>

            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-indigo-900 mb-4">PROJECT LOOKUP</h1>
              <p className="text-gray-600 text-lg">Search and edit existing project data</p>
            </div>

            {/* Search Section */}
            <div className="mb-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                Project ID *
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value.toUpperCase())}
                  placeholder="e.g., ES25373"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black font-medium"
                  disabled={isSearching}
                />
                <button
                  onClick={handleSearchProject}
                  disabled={isSearching}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{searchError}</p>
                </div>
              )}

              {projectFound && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Project found! You can now edit the details below.
                  </p>
                </div>
              )}
            </div>

            {/* Edit Form - Only show if project is found */}
            {projectFound && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Client Name */}
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black" 
                    placeholder="Enter client name"
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <input
                    type="text"
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    placeholder="Enter event type"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    placeholder="Enter contact person name"
                  />
                </div>

                {/* Client Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="clientContactNo" className="block text-sm font-medium text-gray-700 mb-2">
                      Client Contact No.
                    </label>
                    <input
                      type="tel"
                      id="clientContactNo"
                      name="clientContactNo"
                      value={formData.clientContactNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div>
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Client Email
                    </label>
                    <input
                      type="email"
                      id="clientEmail"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                    />
                  </div>
                </div>

                {/* Time Slots - Dynamic fields based on date range */}
                {formData.startDate && formData.endDate && getDatesInRange(formData.startDate, formData.endDate).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Event Times</h3>
                    <div className="space-y-4">
                      {getDatesInRange(formData.startDate, formData.endDate).map((date) => (
                        <div key={date} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-md font-medium text-gray-800 mb-3">
                            {formatDateForDisplay(date)}:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor={`start-${date}`} className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time *
                              </label>
                              <input
                                type="time"
                                id={`start-${date}`}
                                value={timeSlots[date]?.startTime || ''}
                                onChange={(e) => handleTimeSlotChange(date, 'startTime', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                              />
                            </div>
                            <div>
                              <label htmlFor={`end-${date}`} className="block text-sm font-medium text-gray-700 mb-2">
                                End Time *
                              </label>
                              <input
                                type="time"
                                id={`end-${date}`}
                                value={timeSlots[date]?.endTime || ''}
                                onChange={(e) => handleTimeSlotChange(date, 'endTime', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    placeholder="Enter location"
                  />
                </div>

                {/* Account Manager Initials */}
                <div>
                  <label htmlFor="accountManagerInitials" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Manager Initials *
                  </label>
                  <input
                    type="text"
                    id="accountManagerInitials"
                    name="accountManagerInitials"
                    value={formData.accountManagerInitials}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    placeholder="Enter your initials (e.g., AB)"
                  />
                </div>

                {/* Roles Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Roles Required</h3>
                    <button
                      type="button"
                      onClick={addRole}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-md font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Role
                    </button>
                  </div>

                  <div className="space-y-4">
                    {roles.map((roleItem, index) => (
                      <div key={roleItem.id} className="border border-gray-200 rounded-lg p-4 bg-white relative shadow-sm">
                        {roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRole(roleItem.id)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                            title="Remove this role"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">{index + 1}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-800">
                            Role {index + 1}
                          </h4>
                        </div>

                        {/* Role, Quantity, and Hourly Rate */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                          <div className="md:col-span-3">
                            <label htmlFor={`role-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Role *
                            </label>
                            <input
                              type="text"
                              id={`role-${roleItem.id}`}
                              value={roleItem.role}
                              onChange={(e) => handleRoleChange(roleItem.id, 'role', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                              placeholder="Enter role"
                            />
                          </div>

                          <div className="md:col-span-1">
                            <label htmlFor={`quantity-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Qty *
                            </label>
                            <input
                              type="number"
                              id={`quantity-${roleItem.id}`}
                              value={roleItem.quantity}
                              onChange={(e) => handleRoleChange(roleItem.id, 'quantity', e.target.value)}
                              required
                              min="1"
                              max="999"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-center text-sm"
                              placeholder="0"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label htmlFor={`hourlyRate-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Hourly Rate *
                            </label>
                            <input
                              type="number"
                              id={`hourlyRate-${roleItem.id}`}
                              value={roleItem.hourlyRate}
                              onChange={(e) => handleRoleChange(roleItem.id, 'hourlyRate', e.target.value)}
                              required
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        {/* Fixed Outgoing Rate */}
                        <div className="mb-3">
                          <label htmlFor={`fixedOutgoingRate-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Fixed Outgoing Rate per Hour
                          </label>
                          <input
                            type="number"
                            id={`fixedOutgoingRate-${roleItem.id}`}
                            value={roleItem.fixedOutgoingRate}
                            onChange={(e) => handleRoleChange(roleItem.id, 'fixedOutgoingRate', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Gender and Language - Show when role is filled */}
                        {roleItem.role && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                            <div>
                              <label htmlFor={`gender-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Gender *
                              </label>
                              <input
                                type="text"
                                id={`gender-${roleItem.id}`}
                                value={roleItem.gender}
                                onChange={(e) => handleRoleChange(roleItem.id, 'gender', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                                placeholder="Gender"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`language-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Language *
                              </label>
                              <input
                                type="text"
                                id={`language-${roleItem.id}`}
                                value={roleItem.language}
                                onChange={(e) => handleRoleChange(roleItem.id, 'language', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                                placeholder="e.g., English, Spanish"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote Source */}
                <div>
                  <label htmlFor="quoteSource" className="block text-sm font-medium text-gray-700 mb-2">
                    Where are you quoting from? *
                  </label>
                  <select
                    id="quoteSource"
                    name="quoteSource"
                    value={formData.quoteSource}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black bg-white"
                  >
                    <option value="">Select quote source</option>
                    <option value="JAM UAE">JAM UAE</option>
                    <option value="JAM KSA">JAM KSA</option>
                  </select>
                </div>

                {/* Xero Contact with Autocomplete */}
                <div className="relative">
                  <label htmlFor="xeroContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Xero Contact
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="xeroContact"
                    name="xeroContact"
                    value={formData.xeroContact}
                    onChange={handleXeroContactInputChange}
                    onKeyDown={handleXeroContactKeyDown}
                    onFocus={handleXeroContactFocus}
                    onBlur={handleXeroContactBlur}
                    disabled={!formData.quoteSource}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black ${
                      !formData.quoteSource ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    }`}
                    placeholder={formData.quoteSource ? "Start typing to search Xero contacts..." : "Please select quote source first"}
                    autoComplete="off"
                  />

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-150 ${
                            index === selectedSuggestionIndex ? 'bg-indigo-100' : ''
                          }`}
                          onClick={() => handleXeroContactSuggestionClick(suggestion)}
                        >
                          <div className="text-sm text-gray-900">{suggestion}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Updating...' : 'Update Project'}
                </button>
              </form>
            )}

            {/* Submit Message */}
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg ${
                submitMessage.includes('success')
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  submitMessage.includes('success')
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {submitMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

