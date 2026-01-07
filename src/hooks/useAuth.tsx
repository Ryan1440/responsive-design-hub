import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AppRole = 'admin' | 'client' | 'vendor';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  availableRoles: AppRole[];
  needsRoleSelection: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; roles?: AppRole[] }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string; phone?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  selectRole: (role: AppRole) => void;
  clearRoleSelection: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<AppRole[]>([]);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetching with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setAvailableRoles([]);
          setNeedsRoleSelection(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      
      let roles = (data?.map(r => r.role) ?? []) as AppRole[];
      
      // If user has no roles, create default 'client' role
      if (roles.length === 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'client' });
        
        if (!insertError) {
          roles = ['client'];
        }
      }
      
      setAvailableRoles(roles);
      
      // If user already has a selected role, keep it
      // Otherwise, auto-select if only one role
      if (!userRole && roles.length === 1) {
        setUserRole(roles[0]);
        setNeedsRoleSelection(false);
      } else if (!userRole && roles.length > 1) {
        setNeedsRoleSelection(true);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRole(null);
      setAvailableRoles([]);
    }
  };

  const selectRole = (role: AppRole) => {
    if (availableRoles.includes(role)) {
      setUserRole(role);
      setNeedsRoleSelection(false);
    }
  };

  const clearRoleSelection = () => {
    setNeedsRoleSelection(false);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string; phone?: string }
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setAvailableRoles([]);
    setNeedsRoleSelection(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole, 
      availableRoles,
      needsRoleSelection,
      signIn, 
      signUp, 
      signOut,
      selectRole,
      clearRoleSelection,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
