-- ==========================================
-- FIX: Políticas RLS para tabla memberships
-- ==========================================
-- SOLUCIÓN: Eliminar recursión infinita en políticas

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Ver miembros del mismo club" ON public.memberships;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Owners can update memberships" ON public.memberships;

-- 2. POLÍTICA SIMPLE PARA SELECT (SIN RECURSIÓN)
-- Un usuario puede ver sus propias membresías
CREATE POLICY "select_own_memberships"
ON public.memberships
FOR SELECT
USING (auth.uid() = user_id);

-- 3. POLÍTICA SIMPLE PARA INSERT (SIN RECURSIÓN)
-- Un usuario puede crear membresías para sí mismo
-- (Los owners pueden agregar otros miembros mediante una función de base de datos)
CREATE POLICY "insert_own_memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. POLÍTICA SIMPLE PARA UPDATE (SIN RECURSIÓN)
-- Un usuario puede actualizar sus propias membresías
CREATE POLICY "update_own_memberships"
ON public.memberships
FOR UPDATE
USING (auth.uid() = user_id);

-- 5. POLÍTICA SIMPLE PARA DELETE (SIN RECURSIÓN)
-- Un usuario puede eliminar sus propias membresías (salir del club)
CREATE POLICY "delete_own_memberships"
ON public.memberships
FOR DELETE
USING (auth.uid() = user_id);

-- ==========================================
-- VERIFICACIÓN
-- ==========================================
-- Ejecuta esto para verificar que las políticas se crearon correctamente:
-- SELECT * FROM pg_policies WHERE tablename = 'memberships';

-- Prueba que funciona:
-- SELECT * FROM memberships WHERE user_id = auth.uid();
